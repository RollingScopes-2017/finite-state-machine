class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */

    constructor(config) {
        if(config !== undefined) {
            this.config = config;
            this.activeState = config.initial;
            this.statesArray = [];
            this.statesArray.push(this.activeState);
            this.undoArray = [];
            this.undoState = false;
        } else throw new SyntaxError(Error); 
    }
    
    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        if(this.activeState) return this.activeState;
        else throw new SyntaxError(Error);
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        if(this.config.states[state] !== undefined) {
            this.activeState = state;
            this.statesArray.push(this.activeState);
            this.undoState = false;
        } else throw new SyntaxError(Error);
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        if(this.config.states[this.activeState].transitions[event] !== undefined) {
            this.activeState = this.config.states[this.activeState].transitions[event];
            this.statesArray.push(this.activeState);
            this.undoState = false;
        } else throw new SyntaxError(Error);
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.changeState(this.config.initial);
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        let that = this;
        if(event) {
            let array =  Object.keys(this.config.states).map(function (key) 
                {
                    if(that.config.states[key].transitions[event]) return key
                    else ;
                });
            var newArray = new Array();
            for (var i = 0; i < array.length; i++) {
                if (array[i]) {
                newArray.push(array[i]);
                }
            }
            return newArray;
        } else return Object.keys(this.config.states);
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        if(this.statesArray.length == 1) return false;
        if(this.statesArray[this.statesArray.length - 2]) {
            let current = this.statesArray[this.statesArray.length - 2];
            this.undoArray.push(this.statesArray[this.statesArray.length - 1]);
            this.statesArray.splice(this.statesArray.length - 2,2);
            this.changeState(current);
            this.undoState = true;
            return true;
        } 
        return false;
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        if(this.undoState) {
            this.changeState(this.undoArray[this.undoArray.length - 1]);
            this.undoArray.splice(this.undoArray.length - 1,1);
            if(this.undoArray.length !== 0) this.undoState = true;
            return true;            
        }
        return false;
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this.statesArray = [];
        this.statesArray.push(this.activeState)
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
