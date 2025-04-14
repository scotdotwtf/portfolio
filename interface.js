function clipFilter() {
  /* Bug you are litterally getting the sloppy COPY when our paths cross, you are a legend for coding ts <3 */
  function GetImageCorners(Image) {
    void Image.offsetWidth;

    if (Image.getBoxQuads) {
      const Quads = Image.getBoxQuads();
      if (Quads.length > 0) {
        const Quad = Quads[0];
        return [
          { X: Quad.p1.x, Y: Quad.p1.y },
          { X: Quad.p2.x, Y: Quad.p2.y },
          { X: Quad.p3.x, Y: Quad.p3.y },
          { X: Quad.p4.x, Y: Quad.p4.y }
        ];
      }
    }
    
    const Style = window.getComputedStyle(Image);
    const Transform = Style.transform;
    const Rect = Image.getBoundingClientRect();
    const W = Image.offsetWidth;
    const H = Image.offsetHeight;

    const Cx = Rect.left + Rect.width / 2;
    const Cy = Rect.top + Rect.height / 2;
    let Angle = 0;
    if (Transform && Transform !== 'none') {
      try {
        const M = new DOMMatrix(Transform);
        Angle = Math.atan2(M.b, M.a);
      } catch (E) {
        Angle = 0;
      }
    }
    const LocalCorners = [
      { X: -W / 2, Y: -H / 2 },
      { X:  W / 2, Y: -H / 2 },
      { X:  W / 2, Y:  H / 2 },
      { X: -W / 2, Y:  H / 2 }
    ];
    return LocalCorners.map(Pt => ({
      X: Pt.X * Math.cos(Angle) - Pt.Y * Math.sin(Angle) + Cx,
      Y: Pt.X * Math.sin(Angle) + Pt.Y * Math.cos(Angle) + Cy
    }));
  }

  function UpdateLogoClipPath() {
    const WhiteLogo = document.getElementById('logo-white');
    if (!WhiteLogo) return;

    let Defs = WhiteLogo.querySelector('defs');
    if (!Defs) {
      Defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
      WhiteLogo.insertBefore(Defs, WhiteLogo.firstChild);
    }

    let ClipPath = Defs.querySelector('#logoClip');
    if (!ClipPath) {
      ClipPath = document.createElementNS("http://www.w3.org/2000/svg", "clipPath");
      ClipPath.setAttribute('id', 'logoClip');
      Defs.appendChild(ClipPath);
    }

    while (ClipPath.firstChild) {
      ClipPath.removeChild(ClipPath.firstChild);
    }

    const Images = document.querySelectorAll('.Images img');
    Images.forEach(Image => {
      const Corners = GetImageCorners(Image);
      const CTM = WhiteLogo.getScreenCTM();
      if (!CTM) return;
      const InvCTM = CTM.inverse();

      const Pts = Corners.map(Pt => {
        const SvgPt = WhiteLogo.createSVGPoint();
        SvgPt.x = Pt.X;
        SvgPt.y = Pt.Y;
        return SvgPt.matrixTransform(InvCTM);
      });

      const PointsStr = Pts.map(Pt => `${Pt.x},${Pt.y}`).join(" ");
      const Polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
      Polygon.setAttribute("points", PointsStr);
      ClipPath.appendChild(Polygon);
    });
  }

  function ContinuousUpdate() {
    UpdateLogoClipPath();
    requestAnimationFrame(ContinuousUpdate);
  }

  requestAnimationFrame(ContinuousUpdate);

  (function EnableDraggableLogo() {
    const LogoContainer = document.querySelector('.Logo');
    let IsDragging = false;
    let StartX, StartY, InitLeft, InitTop;
    
    LogoContainer.style.position = "absolute";
    LogoContainer.style.cursor = "move";
    
    LogoContainer.addEventListener('mousedown', function(E) {
      IsDragging = true;
      StartX = E.clientX;
      StartY = E.clientY;
      InitLeft = parseInt(window.getComputedStyle(LogoContainer).left, 10) || 0;
      InitTop = parseInt(window.getComputedStyle(LogoContainer).top, 10) || 0;
      E.preventDefault();
    });
    
    document.addEventListener('mousemove', function(E) {
      if (IsDragging) {
        const Dx = E.clientX - StartX;
        const Dy = E.clientY - StartY;
        LogoContainer.style.left = (InitLeft + Dx) + 'px';
        LogoContainer.style.top = (InitTop + Dy) + 'px';
      }
    });
    
    document.addEventListener('mouseup', function() {
      IsDragging = false;
    });
  })();
}

function dvdBounce() {
    /* Dvd bounce by harikrishnan <3 */
    let x = 0,
    y = 0,
    dirX = 1,
    dirY = 1;
    const speed = 1;
    let dvd = document.querySelector(".DvdWrapper");
    const dvdWidth = dvd.getBoundingClientRect().width;
    const dvdHeight = dvd.getBoundingClientRect().height;
  
    function animate() {
      const screenHeight = window.innerHeight + 6;
      const screenWidth = window.innerWidth;
  
      if (y + dvdHeight >= screenHeight || y < 0) {
        dirY *= -1;
      }
      if (x + dvdWidth >= screenWidth || x < 0) {
        dirX *= -1;
      }
      x += dirX * speed;
      y += dirY * speed;
      dvd.style.left = x + "px";
      dvd.style.top = y + "px";
      if (window.innerWidth <= 775) {
        window.requestAnimationFrame(animate);
      }
    }
  
    window.requestAnimationFrame(animate);
}

var hasClipped = false;
var hasDvd = false;

/* Lazy way of checking for mobile, small optimization */
if (window.innerWidth >= 775) {
  clipFilter();
  hasClipped = true;
  
  /* Randomized image transformation, photo stack look */
  document.querySelectorAll('.Images img').forEach(img => {
    /*const x = Math.random() * 50;*/
    const y = Math.random() * 25;
    const angle = (Math.random() * 10) - 5;
    img.style.transform = `translate(0px, ${y}px) rotate(${angle}deg)`;
  });
} else {
  hasDvd = true;
  /* Mobile */
  document.querySelectorAll('.Images img').forEach(img => {
    const y = Math.random() * 10;
    const angle = (Math.random() * 5) - 2;
    img.style.transform = `translate(0px, ${y}px) rotate(${angle}deg)`;
  });

  dvdBounce();
}

/* Another lazy fix */
addEventListener("resize", (event) => {
  if (window.innerWidth >= 775 && hasClipped == false) {
    clipFilter();
    hasClipped = true;
  }
  
  if (window.innerWidth <= 775 && hasDvd == false) {
    dvdBounce();
    hasDvd = true;
  } else if (window.innerWidth >= 775) {
    hasDvd = false;
  }
});
