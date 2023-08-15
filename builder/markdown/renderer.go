package markdown

import (
	"github.com/yuin/goldmark"
	"github.com/yuin/goldmark/ast"
	"github.com/yuin/goldmark/renderer"
	goldmarkUtil "github.com/yuin/goldmark/util"
)

// BufWriter is a wrapper of goldmark/util.BufWriter.
type BufWriter = goldmarkUtil.BufWriter

// NodeRenderer is a custom node renderer.
type NodeRenderer interface {
	Priority() int
	Kind() ast.NodeKind
	Render(w BufWriter, source []byte, node ast.Node, entering bool) (ast.WalkStatus, error)
}

// WithNodeRenderers is an option to register [NodeRenderer]s.
//
// This function wraps goldmark.WithRendererOptions, goldmark/renderer.WithNodeRenderers, and goldmark/util.Prioritized.WithNodeRenderers.
func WithNodeRenderers(xs ...NodeRenderer) Option {
	var rs []goldmarkUtil.PrioritizedValue
	for _, x := range xs {
		rs = append(rs, goldmarkUtil.Prioritized(nodeRendererRegisterer{
			Kind:       x.Kind(),
			RenderFunc: x.Render,
		}, x.Priority()))
	}
	return goldmark.WithRendererOptions(renderer.WithNodeRenderers(rs...))
}

type nodeRendererRegisterer struct {
	Kind       ast.NodeKind
	RenderFunc renderer.NodeRendererFunc
}

func (r nodeRendererRegisterer) RegisterFuncs(reg renderer.NodeRendererFuncRegisterer) {
	reg.Register(r.Kind, r.RenderFunc)
}
