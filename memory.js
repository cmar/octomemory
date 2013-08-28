function Card(image) {
  this.image = image
  this.order = Math.random() * 1000
  this.score = 0
  this.hiddenImage = "http://octodex.github.com/images/original.png"

  this.$el = $("<img></img>")
               .addClass('card')
               .data('card', this);

  this.changeState('hidden')
}

Card.prototype.changeState = function(state) {
  this.state = state

  switch(this.state) {
    case 'hidden':
      this.$el.attr('src', this.hiddenImage)
      break
    case 'selected':
      this.$el.attr('src', this.image)
      break
    case 'matched':
      this.$el.attr('src', this.image)
      this.$el.addClass('matched')
      this.score = 10
      break
  }
}

Card.prototype.matches = function(other) {
  return this.image == other.image
}

var board = {
  start: function() {
    this.cards = []
    $("#board").empty();

    $("#score").text(0)
    $("#clicks").text(0)

    $("#images").children("img").each(function() {
      var image = $(this).attr('src')
      board.cards.push(new Card(image))
      board.cards.push(new Card(image))
    })

    this.cards.sort(function(a, b) {
      return b.order - a.order;
    })

    this.cards.forEach(function(card) {
      $("#board").append(card.$el);
    })
  },

  selected: function() {
    return this.cards.filter(function(card) {
      return card.state === 'selected'
    })
  },

  checkMatches: function() {
    var selected = this.selected()

    if (selected.length != 2) {
      return;
    }

    if (selected[0].matches(selected[1])) {
      selected.forEach(function(card) {
        card.changeState('matched')
        board.updateScore()
      })
    } else {
      selected.forEach(function(card) {
        setTimeout(function() {
          card.changeState('hidden')
        }, 1000)
      })
    }
  },

  updateScore: function() {
    var score = board.cards.reduce(function(score, card) {
      return score + card.score;
    }, 0)
    $("#score").text(score);
  }
}

$(function() {
  board.start()

  $("#board").on("click", ".card", function(event) {
    var card = $(this).data('card')
    if (card.state == 'matched') {
      return;
    }

    card.changeState('selected')
    board.checkMatches()
  })

  $("#board").on("click", ".card", function(event) {
    var card = $(this).data('card')
    if (card.state == 'matched') {
      return;
    }

    var current = parseInt($("#clicks").text())
    $("#clicks").text(++current)
  })

  $("#reset").click(function(event) {
    event.preventDefault();
    board.start()
  })

  $("#cheat").click(function(event) {
    event.preventDefault();

    var selected = board.selected();
    if (selected.length == 1) {
      board.cards.forEach(function(card) {
        if (card.matches(selected[0])) {
          card.changeState('matched')
          selected[0].changeState('matched')
        }
        board.updateScore();
      })
    }
  })
})
