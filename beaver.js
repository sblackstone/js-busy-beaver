var TapeNode = function() {
  this.left = null;
  this.right = null;  
  this.value = 0;
  this.node_id = 0;
};

TapeNode.prototype.get_left = function() {
	if (this.left === null) {
		this.left = new TapeNode();
    this.left.node_id = this.node_id - 1;
 		this.left.right = this;
	}
	return this.left;
}

TapeNode.prototype.get_right = function() {
	if (this.right === null) {
		this.right = new TapeNode();
    this.right.node_id = this.node_id + 1;

		this.right.left = this;
	}
	return this.right;
}


var Tape = function() {
	this.current = new TapeNode();		
}

Tape.prototype.move_left = function() {
	this.current = this.current.get_left();	
}

Tape.prototype.move_right = function() {
	this.current = this.current.get_right();	
}


window.t = new TapeNode();


angular.module('beaver-app', [])
  .controller('BeaverController', function() {
    var beaver = this;
    beaver.state_count = 2;
    beaver.tape = null;
    beaver.current_state = null;

    beaver.run = function() {
	    beaver.current_state = beaver.states[0];
      beaver.tape          = new Tape();
      beaver.loop_timer = window.setTimeout(beaver.one_loop, 250);
    }

    beaver.one_loop = function() {
		    console.log("Executing state " + beaver.current_state.id);
		    var cur_val = beaver.tape.current.value;
		    console.log('Read a ' + cur_val + " at position " + beaver.tape.current.node_id);
        var ins = beaver.current_state.instructions[cur_val];
        console.log("instructions = ");
        console.log(ins);

        console.log('Writing a ' + ins.write + " to node " +  beaver.tape.current.node_id);
        beaver.tape.current.value = parseInt(ins.write);

        if (ins.move == 'L') {
 	        beaver.tape.move_left();
          console.log("Moving left, new position = " + beaver.tape.current.node_id); 
       }
        if (ins.move == 'R') {
 	        beaver.tape.move_right();
          console.log("Moving right, new position = " + beaver.tape.current.node_id); 
       }

       if (ins.next == 'H') {
         console.log('HALTING!');
         return;
       } else {
	       console.log("Setting current state to " + ins.next);
	       beaver.current_state = beaver.states[parseInt(ins.next)];
       }
       console.log("------");		
       beaver.loop_timer = window.setTimeout(beaver.one_loop, 1000);
    }

    beaver.next_values = function() {
	    var r = [];
	    for (var i =0; i < beaver.state_count; i++) {
		    r.push(i);
	    }
	    r.push('H');
	    return(r);
    }

    beaver.initialize_states = function() {
	    beaver.states = [];
	    for(var i=0;i< beaver.state_count;i++) {
	      beaver.states.push({
          id: i,
		      instructions: [ 
			                         {write: 0, move: 'L', next: '0'},
			                         {write: 0, move: 'L', next: '0'}
			                  ]
	      });
	    }	
    };

    beaver.initialize_states();

    window.beaver = this;





  });

