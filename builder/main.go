package main

import (
	"fmt"
	"log"
	"os"
	"path/filepath"
	"strings"
	"sync"
	"sync/atomic"
	"time"
)

type ModTimer interface {
	ModTime() time.Time
}

func CreateOutput(path string, conf ConvertConfig) (*os.File, error) {
	log.Println("Create", path)
	os.MkdirAll(filepath.Join(conf.Destination, filepath.Dir(path)), 0755)
	return os.Create(filepath.Join(conf.Destination, path))
}

func NeedToUpdate[T ModTimer](targetPath string, sourceInfo T, conf ConvertConfig) bool {
	target, err := os.Stat(filepath.Join(conf.Destination, targetPath))

	return err != nil || target.ModTime().Compare(sourceInfo.ModTime()) <= 0
}

type TaskQueue struct {
	wg       sync.WaitGroup
	errCount atomic.Int32
	n        int
	queue    chan func() error
}

func NewTaskQueue(n int) *TaskQueue {
	return &TaskQueue{
		n:     n,
		queue: make(chan func() error, n),
	}
}

func (q *TaskQueue) AddTask(task func() error) {
	q.queue <- task
}

func (q *TaskQueue) Start() {
	for i := 0; i < q.n; i++ {
		q.wg.Add(1)
		go func() {
			for task := range q.queue {
				if err := task(); err != nil {
					log.Println(err)
					q.errCount.Add(1)
				}
			}
			q.wg.Done()
		}()
	}
}

func (q *TaskQueue) Close() error {
	close(q.queue)
	q.wg.Wait()
	return nil
}

func (q *TaskQueue) ErrorCount() int {
	return int(q.errCount.Load())
}

func main() {
	conf := ConvertConfig{
		Destination:  "../dist",
		Source:       "../pages",
		PostsPerPage: 10,
	}

	template, err := NewTemplateLoader("../templates")
	if err != nil {
		log.Fatal(err)
	}

	indexGenerator := NewIndexGenerator(template)

	mdConverter, err := NewArticleConverter(template, indexGenerator.Hook)
	if err != nil {
		log.Fatal(err)
	}

	converter := ConverterSet{
		mdConverter,
		CopyConverter{},
	}

	queue := NewTaskQueue(4)
	queue.Start()

	err = filepath.Walk(conf.Source, func(fpath string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		if info.IsDir() || strings.HasPrefix(info.Name(), ".") {
			return nil
		}

		path, err := filepath.Rel(conf.Source, fpath)
		if err != nil {
			return err
		}

		queue.AddTask(func() error {
			err := converter.Convert(path, info, conf)
			if err != nil {
				return fmt.Errorf("%w: %s", err, path)
			}
			return nil
		})

		return nil
	})
	if err != nil {
		log.Fatal(err)
	}
	if queue.ErrorCount() != 0 {
		log.Fatal("Error occurred during build.")
	}

	queue.Close()

	err = indexGenerator.Generate(conf)
	if err != nil {
		log.Fatal(err)
	}
}
