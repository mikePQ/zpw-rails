var Seat = /** @class */ (function () {
    function Seat(htmlElement, id) {
        this.htmlElement = htmlElement;
        this.id = id;
        this.isSelected = false;
        this.addClickHandler();
        this.isAvailable = Seat.isAvailable(htmlElement);
    }
    Seat.prototype.addClickHandler = function () {
        var _this = this;
        if (!this.htmlElement) {
            return;
        }
        this.htmlElement.addEventListener("click", function () {
            if (!_this.isSelected && !manager.canSelect(_this)) {
                if (_this.isAvailable) {
                    alert("Nie można wybrać więcej niż 5 miejsc");
                }
                return;
            }
            _this.isSelected = !_this.isSelected;
            if (_this.isSelected) {
                _this.addClass('selected');
            }
            else {
                _this.removeClass('selected');
            }
        });
    };
    Seat.prototype.addClass = function (className) {
        this.htmlElement.classList.add(className);
    };
    Seat.prototype.removeClass = function (className) {
        this.htmlElement.classList.remove(className);
    };
    Seat.isAvailable = function (button) {
        return button.classList.contains('btn-success');
    };
    Seat.initializeSeats = function () {
        var result = [];
        var seatButtons = document.getElementsByClassName('seat-button');
        console.log(seatButtons.length);
        for (var i = 0; i < seatButtons.length; i++) {
            var seatButton = seatButtons.item(i);
            if (seatButton) {
                var seatId = Seat.getSeatId(seatButton);
                if (!seatId) {
                    continue;
                }
                result.push(new Seat(seatButton, seatId));
            }
        }
        return result;
    };
    Seat.getSeatId = function (button) {
        if (!button) {
            return null;
        }
        var child = button.firstChild;
        if (!child) {
            return null;
        }
        return child.textContent;
    };
    return Seat;
}());
var SeatsManager = /** @class */ (function () {
    function SeatsManager() {
        this.seats = Seat.initializeSeats();
    }
    SeatsManager.prototype.getSelected = function () {
        return this.seats.filter(function (seat) { return seat.isSelected; });
    };
    SeatsManager.prototype.canSelect = function (seat) {
        return this.getSelected().length < 5 && seat.isAvailable;
    };
    return SeatsManager;
}());
var manager = new SeatsManager();
//# sourceMappingURL=event.js.map