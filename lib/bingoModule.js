'use strict';
// ---------------------------------
// TAMBOLA TICKET AND DRAW GENERATOR
// ---------------------------------
// A ticket consists of a random distribution of 15 numbers between 1-90 in a
// 3x9 grid
//
// RULE #1 -  Each row cannot have more than 5 numbers
// RULE #2 -  Each column is assigned a range of numbers only:
//            1-10 can appear only in column 1
//            11-20 can appear only in column 2
//            81-90 can appear only in column 9
// RULE #3 -  In a specific column, numbers must be arranged in ascending order
//            from top to bottom

// To generate and display the tickets in the terminal use this command
// node -e "const tambola = require('./lib/bingoModule'); const tickets = tambola.generateTicketSets(6); tambola.displayTicketsInTerminal(tickets);"

/**
 * Generates a random number between 0 and (maxValue - 1).
 *
 * @param {number} maxValue - The maximum value for the random number.
 * @return {number} A random integer between 0 and (maxValue - 1).
 */
function random(maxValue) {
  return Math.floor(Math.random() * maxValue);
}

/* 
 * Manages the pool of available numbers for ticket generation, ensuring each number is used only once across all tickets in a set. 
 * Constructor function for managing the pool of available numbers for ticket generation.
 */
function BingoSerie() {
  this.data = [
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
    [10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
    [20, 21, 22, 23, 24, 25, 26, 27, 28, 29],
    [30, 31, 32, 33, 34, 35, 36, 37, 38, 39],
    [40, 41, 42, 43, 44, 45, 46, 47, 48, 49],
    [50, 51, 52, 53, 54, 55, 56, 57, 58, 59],
    [60, 61, 62, 63, 64, 65, 66, 67, 68, 69],
    [70, 71, 72, 73, 74, 75, 76, 77, 78, 79],
    [80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90]
  ];

    /**
   * Selects the next element from the specified column in the data array and removes it from the array.
   *
   * @param {number} column - The index of the column from which to select the next element.
   * @return {number} The selected element from the specified column.
   */
  this.selectNext = function(column) {
    const arr = this.data[column];
    const index = random(arr.length);
    this.data[column] = arr.slice(0, index).concat(arr.slice(index + 1));
    return arr[index];
  };
}

/*
Creates a single Tambola ticket structure, determining the placement of numbers within the 3x9 grid according to Tambola rules.
*/
function BingoTicket(ticket) {
  this.data = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0]
  ];

    /**
   * Selects a random row based on available candidates and updates the rowControl accordingly.
   *
   * @param {object} obj - The object containing the data.
   * @param {object} rowControl - The control object for row operations.
   * @param {number} col - The column index to select the row for.
   * @return {void} This function does not return any value.
   */
  function selectRandomRow(obj, rowControl, col) {
    const candidates = rowControl.available(obj, col);
    const selection = Number(candidates[random(candidates.length)]);
    obj.data[selection][col] = 1;
    rowControl.increase(selection);
  }


  /**
 * Initializes the BingoTicket object by populating the data array with numbers from the ticket array.
 *
 * @param {object} obj - The BingoTicket object to initialize.
 * @return {void} This function does not return anything.
 */
  function init(obj) {
    const arr = ticket.slice(0);
    const rows = {
      one: 0,
      two: 0,
      three: 0,

      /**
     * Returns a string of available row numbers based on the number of available spaces in each row and the value of the specified column in the data array.
     *
     * @param {object} obj - The object containing the data array.
     * @param {number} col - The index of the column to check for available spaces.
     * @return {string} A string of available row numbers, each represented by a digit.
     */
      available: function(obj, col) {
        let s = '';
        if (this.one < 5 && obj.data[0][col] === 0) s = '0';
        if (this.two < 5 && obj.data[1][col] === 0) s = s + '1';
        if (this.three < 5 && obj.data[2][col] === 0) s = s + '2';
        return s;
      },

      /**
       * A function to increase the count based on the provided value.
       *
       * @param {number} value - The value to determine which count to increase.
       * @return {void} This function does not return any value.
       */  
      increase: function(value) {
        if (value === 0) {
          this.one++;
        } else if (value === 1) {
          this.two++;
        } else if (value === 2) {
          this.three++;
        }
      }
    };
    arr.forEach((element, index) => {
      if (element === 3) {
        for (let i = 0; i < 3; i++) {
          selectRandomRow(obj, rows, index);
        }
      }
    });
    arr.forEach((element, index) => {
      if (element === 2) {
        for (let i = 0; i < 2; i++) {
          selectRandomRow(obj, rows, index);
        }
      }
    });
    arr.forEach((element, index) => {
      if (element === 1) {
        selectRandomRow(obj, rows, index);
      }
    });
  }

  init(this);
}

 /* 
 Handles the arrangement of numbers across multiple tickets in a set, ensuring a balanced distribution of numbers. 
 */
function Serie() {
  this.data = [];
  for (let i = 0; i < 6; i++) {
    this.data.push(Array(9).fill(0));
  }

  /**
 * A function to increase the count based on the provided value.
 *
 * @param {number} value - The value to determine which count to increase.
 * @return {void} This function does not return any value.
 */
  this.fillColumn = function(col, arr) {
    arr.forEach((v, i) => { this.data[i][col] = Number(v); });
  };
  /**
   * Sets all values in the specified column to 0.
   *
   * @param {number} col - The column index to clean
   * @return {void} This function does not return any value
   */
  this.cleanColumn = function(col) {
    for (let i = 0; i < 6; i++) {
      this.data[i][col] = 0;
    }
  };
  
  /**
   * A function to check the validity of the data based on the provided index.
   *
   * @param {number} index - The index to determine the validity.
   * @return {boolean} Whether the data is valid or not.
   */
  this.isValid = function(index) {
    return !this.data.some((row, ri) => {
      let sum = row.reduce((total, v) => total + v, 0);
      return (sum + 8 - index) > 15;
    });
  };
}

/* 
Generates all possible permutations of a given string, used in creating varied ticket layouts.
*/
function permute(str) {
  const arrPermutes = [];
  const obj = str.split('').reduce((o, v) => {
    o[v] = (o[v] || 0) + 1;
    return o;
  }, {});
  function permutes(result, elements) {
    if (Object.keys(elements).length === 1 && Object.values(elements)[0] === 1) {
      arrPermutes.push(result + Object.keys(elements)[0]);
    } else {
      const local = Object.assign({}, elements);
      Object.keys(elements).forEach(k => {
        const v = local[k];
        if (v === 1) {
          delete local[k];
        } else {
          local[k]--;
        }
        permutes(result + k, local);
        local[k] = v;
      });
    }
  }
  permutes('', obj);
  return arrPermutes;
}

const first = permute('222111').concat(permute('321111'));
const middle = permute('331111').concat(permute('322111')).concat(permute('222211'));
const last = permute('332111').concat(permute('322211')).concat(permute('222221'));

/* 
Recursively generates a valid arrangement of numbers for a set of tickets, ensuring each column follows Tambola rules.
*/
function generateSerie(index, serie) {
  let local = index === 0 ? first.slice(0) : index === 8 ? last.slice(0) : middle.slice(0);
  let result = false;
  while (!result && local.length > 0) {
    const test = local.splice(random(local.length), 1)[0];
    serie.fillColumn(index, test.split(''));
    if (serie.isValid(index)) {
      if (index === 8) return true;
      result = generateSerie(index + 1, serie);
    } else {
      serie.cleanColumn(index);
    }
  }
  return result;
}

/**
 * Generates a specified number of Bingo tickets.
 *
 * @param {number} count - The number of tickets to generate.
 * @return {Array<Array<Array<number>>>} An array of Bingo tickets, where each ticket is represented as a 2D array of numbers.
 */
function generateBingoTickets(count) {
  const bingoSerie = new Serie();
  generateSerie(0, bingoSerie);
  const serie = new BingoSerie();
  
  const tickets = [];
  for (let e = 0; e < count; e++) {
    const ticket = new BingoTicket(bingoSerie.data[e]);
    const formattedTicket = ticket.data.map(row => 
      row.map((item, j) => item === 0 ? 0 : serie.selectNext(j))
    );
    tickets.push(formattedTicket);
  }
  
  // return tickets;
  return sortTicketColumns(tickets);
}

/**
 * Generates Bingo game logic to play with provided tickets and callback.
 *
 * @param {Array<Array<Array<number>>} tickets - The Bingo tickets to play with.
 * @param {Function} callback - The callback function to handle game events.
 */
function startBingo(tickets, callback) {
  const balls = Array.from({length: 90}, (_, i) => i + 1);
  const markedTickets = tickets.map(ticket => ticket.map(row => row.map(() => false)));
  
  const id = setInterval(() => {
    if (balls.length === 0) {
      clearInterval(id);
      callback(null, 'Game Over');
      return;
    }

    const ball = balls.splice(random(balls.length), 1)[0];

    tickets.forEach((ticket, ticketIndex) => {
      ticket.forEach((row, rowIndex) => {
        row.forEach((number, colIndex) => {
          if (number === ball) {
            markedTickets[ticketIndex][rowIndex][colIndex] = true;
          }
        });
      });
    });

    if (checkFullTicket(markedTickets)) {
      clearInterval(id);
      callback(null, 'WIN');
    } else {
      callback(ball);
    }
  }, 400);

  function checkFullTicket() {
    return markedTickets.some(ticket => 
      ticket.every(row => row.filter(Boolean).length === row.length) &&
      ticket.flat().filter(Boolean).length === 15
    );
  }
}



/**
 * Sorts the columns of each ticket in the given array of tickets.
 *
 * @param {Array<Array<Array<number>>>} tickets - The array of tickets to sort.
 * @return {Array<Array<Array<number>>>} - The array of tickets with sorted columns.
 */
function sortTicketColumns(tickets) {
  return tickets.map(ticket => {
    const sortedTicket = ticket.map(row => [...row]);
    for (let col = 0; col < 9; col++) {
      const column = sortedTicket.map(row => row[col]).filter(num => num !== 0).sort((a, b) => a - b);
      let index = 0;
      sortedTicket.forEach(row => {
        if (row[col] !== 0) {
          row[col] = column[index++];
        }
      });
    }
    return sortedTicket;
  });
}


/**
 * Displays the tickets in the terminal with a formatted layout.
 *
 * @param {Array<Array<number>>} tickets - The array of tickets to display.
 * @return {void}
 */
function displayTicketsInTerminal(tickets) {
  tickets.forEach((ticket, ticketIndex) => {
    console.log(`\nTicket ${ticketIndex + 1}:`);
    console.log('-'.repeat(27));
    ticket.forEach(row => {
      console.log('|' + row.map(num => num ? num.toString().padStart(2) : '  ').join('|') + '|');
    });
    console.log('-'.repeat(27));
  });
}


/* 
Creates sets of Tambola tickets based on the requested number. It generates full sets of 6 tickets and handles any remaining tickets by creating an additional partial set.
*/
function generateTicketSets(numberOfTickets) {
  const fullSets = Math.floor(numberOfTickets / 6);
  const extraTickets = numberOfTickets % 6;

  let allTickets = [];

  // Generate full sets of 6 tickets
  for (let i = 0; i < fullSets; i++) {
    const tickets = generateBingoTickets(6);
    allTickets = allTickets.concat(sortTicketColumns(tickets));
  }

  // Generate extra tickets if needed
  if (extraTickets > 0) {
    const extraSet = generateBingoTickets(6).slice(0, extraTickets);
    allTickets = allTickets.concat(sortTicketColumns(extraSet));
  }

  return allTickets;
}


module.exports = {
  generateBingoTickets,
  sortTicketColumns,
  startBingo,
  displayTicketsInTerminal,
  generateTicketSets
};
