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
  this.ones_count = 0;
}

Tape.prototype.set_value = function(n) {
  if (this.current.value == 1 && n == 0) {
    this.ones_count--;
  }
  if (this.current.value == 0 && n == 1) {
    this.ones_count++;
  }
  this.current.value = n;
}

Tape.prototype.move_left = function() {
  this.current = this.current.get_left(); 
}

Tape.prototype.move_right = function() {
  this.current = this.current.get_right();  
}


window.t = new TapeNode();


var app = angular.module('beaver-app', []);

//
// I don't understand why this isnt somehow a built-in feature..
// Thanks, http://stackoverflow.com/questions/11873570/angularjs-for-loop-with-numbers-ranges
//
app.filter('makeRange', function() {
     return function(input) {
         var lowBound, highBound;
         switch (input.length) {
         case 1:
             lowBound = 0;
             highBound = parseInt(input[0]) - 1;
             break;
         case 2:
             lowBound = parseInt(input[0]);
             highBound = parseInt(input[1]);
             break;
         default:
             return input;
         }
         var result = [];
         for (var i = lowBound; i <= highBound; i++)
             result.push(i);
         return result;
     };
 });


app.controller('BeaverController', function() {
    var beaver = this;
    beaver.state_count = 2;
    beaver.tape = null;
    beaver.current_state = null;
    beaver.loop_speed = 250;
    beaver.step_count = 0;
    beaver.state_chars = {
      0: 'A',
      1: 'B',
      2: 'C',
      3: 'D',
      4: 'E',
      'H': 'H',
  
   };
   
    beaver.run = function() {
      beaver.current_state = beaver.states[0];
      beaver.step_count = 0;
      beaver.tape          = new Tape();
      beaver.loop_timer = window.setTimeout(beaver.one_loop, 1);
    }

   beaver.stop = function() {
     window.clearTimeout(beaver.loop_timer);	
   }

    beaver.one_loop = function() {
        beaver.step_count++;
        console.log("Step = " + beaver.step_count);
        console.log("Executing state " + beaver.current_state.id);
        var cur_val = beaver.tape.current.value;
        console.log('Read a ' + cur_val + " at position " + beaver.tape.current.node_id);
        var ins = beaver.current_state.instructions[cur_val];
        console.log("instructions: write a " + ins.write + ", move " + ins.move + " and goto state " + ins.next);

        console.log('Writing a ' + ins.write + " to node " +  beaver.tape.current.node_id);
        beaver.tape.set_value(parseInt(ins.write));

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
         console.log('Total ones on tape is ' + beaver.tape.ones_count);
         return;
       } else {
         console.log("Setting current state to " + ins.next);
         beaver.current_state = beaver.states[parseInt(ins.next)];
       }
       console.log("------");   
       beaver.loop_timer = window.setTimeout(beaver.one_loop, beaver.loop_speed );
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

