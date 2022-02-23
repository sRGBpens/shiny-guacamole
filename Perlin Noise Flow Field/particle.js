   function Particle() {
    this.pos = createVector(random(width), random(height));
    this.vel = createVector(0,0);
    this.acc = createVector(0,0);
    this.maxSpeed = 2;
    let c = 0;

    this.prevPos = this.pos.copy();

    this.update = function() {
        this.vel.add(this.acc);
        this.vel.limit(this.maxSpeed);
        this.pos.add(this.vel);
        this.acc.mult(0);
        if (c > 360) c = 0;
        c++
    }

    this.follow = function(vectors) {
        let x = floor(this.pos.x/scl);
        let y = floor(this.pos.y/scl);
        let index = x + y * cols;
        let force = vectors[index];
        this.applyForce(force);   
    }

    this.applyForce = function(force) {
        this.acc.add(force);
    }

    this.show = function() {
        stroke(c,100,100,.01);
        strokeWeight(1);
        line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y)
        // point(this.pos.x, this.pos.y);
        this.updatePrev();
    }

    this.updatePrev = function() {
        this.prevPos.x = this.pos.x;
        this.prevPos.y = this.pos.y;
    }

    this.edges = function() {
        // if (this.pos.x > width) this.pos.x = 0;
        // if (this.pos.x < 0) this.pos.x = width;
        // if (this.pos.y > height) this.pos.y = 0;
        // if (this.pos.y < 0) this.pos.y = height;
        
        if (this.pos.x > width) {
            this.pos.x = 0;
            this.updatePrev();
        }
        if (this.pos.x < 0) {
            this.pos.x = width;
            this.updatePrev();
        }
        if (this.pos.y > height) {
            this.pos.y = 0;
            this.updatePrev();
        }
        if (this.pos.y < 0) {
            this.pos.y = height;
            this.updatePrev();
        }
    }
}
     