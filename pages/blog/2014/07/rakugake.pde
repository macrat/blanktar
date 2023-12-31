// vim: se ft=java expandtab ts=2 :
//
//		らくがけ
//
//					MIT License (c)2014 MacRat

ArrayList<int[]> dots;

int colorstep = 2;

boolean drawcircle = true;
boolean drawbox = false;
boolean drawline = true;
int cred = 0;
int cgreen = 0;
int cblue = 0;
int mred = 0;
int mgreen = 0;
int mblue = 0;
boolean bgreverse = false;
boolean scrshot = false;

void setup()
{
  size(800, 600);
  if(!bgreverse)
  {
    background(255, 255, 255);
  }else
  {
    background(0, 0, 0);
  }
  fill(color(cred, cgreen, cblue));
  stroke(color(cred, cgreen, cblue));
  smooth();
  
  dots = new ArrayList<int[]>();
}

void keyPressed()
{
    switch(key)
    {
      case ' ':
        dots.clear();
        break;
      case 'z':
        drawcircle = !drawcircle;
        break;
      case 'x':
        drawbox = !drawbox;
        break;
      case 'c':
        drawline = !drawline;
        break;
      case 'q':
        mred = colorstep;
        break;
      case 'a':
        mred = -colorstep;
        break;
      case 'w':
        mgreen = colorstep;
        break;
      case 's':
        mgreen = -colorstep;
        break;
      case 'e':
        mblue = colorstep;
        break;
      case 'd':
        mblue = -colorstep;
        break;
      case 'r':
        bgreverse = !bgreverse;
        break;
      case 'p':
        scrshot = true;
        break;
    }
}

void keyReleased()
{
  switch(key)
  {
    case 'q':
    case 'a':
      mred = 0;
      break;
    case 'w':
    case 's':
      mgreen = 0;
      break;
    case 'e':
    case 'd':
      mblue = 0;
  }
}

void draw()
{
  if(mousePressed == true)
  {
    int[] tmp = {pmouseX, pmouseY, mouseX, mouseY};
    dots.add(tmp);
  }
  
  cred = Math.max(Math.min(cred+mred, 255), 0);
  cgreen = Math.max(Math.min(cgreen+mgreen, 255), 0);
  cblue = Math.max(Math.min(cblue+mblue, 255), 0);
  
  if(!bgreverse)
  {
    background(255, 255, 255);
  }else
  {
    background(0, 0, 0);
  }
  fill(color(cred, cgreen, cblue));
  stroke(color(cred, cgreen, cblue));
  
  if(!scrshot)
  {
      text("circle(key: z): " + (drawcircle?"visible":"hide"), 10, 20);
      text("box(key: x): " + (drawbox?"visible":"hide"), 10, 40);
      text("line(key: c): " + (drawline?"visible":"hide"), 10, 60);
      text("red(key: q/a): " + Math.round((cred/255.0) * 100) + "%", 10, 80);
      text("green(key: w/s): " + Math.round((cgreen/255.0) * 100) + "%", 10, 100);
      text("blue(key: e/d): " + Math.round((cblue/255.0) * 100) + "%", 10, 120);
      text("background(key: r): " + (bgreverse?"black":"white"), 10, 140);
      text("clear(space)", 10, 160);
      text("screenshot(p)", 10, 180);
  }
  
  for(int i=0; i<dots.size(); i++)
  {
    int[] mouse = dots.get(i);
    
    if(drawcircle)
    {
      ellipse(mouse[2], mouse[3], abs(mouse[3]-mouse[1]), abs(mouse[2]-mouse[0]));
    }
    if(drawbox)
    {
      int xsize = abs(mouse[3]-mouse[1]);
      int ysize = abs(mouse[2]-mouse[0]);
      rect(mouse[2]-xsize/2, mouse[3]-ysize/2, xsize, ysize);
    }
    if(drawline)
    {
      line(mouse[0], mouse[1], mouse[2], mouse[3]);
    }
  }

  if(scrshot)
  {
      save("" + year() + month() + day() + hour() + minute() + second() + ".png");
      scrshot = false;
  }
}
