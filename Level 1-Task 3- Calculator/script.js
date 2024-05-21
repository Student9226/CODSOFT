document.addEventListener('DOMContentLoaded', function () {
    const displayCurrent = document.getElementById('current-operation');
    const displayPrevious = document.getElementById('previous-operation');
    const buttons = document.querySelectorAll('.button');
    const historyList = document.getElementById('history-list');
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const clearHistoryButton = document.querySelector('.clear');

    let currentInput = '';
    let expression = '';
    let previousOperation = '';
    let justEvaluated = false;

    darkModeToggle.addEventListener('click', () => {
        console.log("Dark mode toggle button clicked");
        document.body.classList.toggle('dark-mode');
    });

    buttons.forEach(button => {
        button.addEventListener('click', function () {
            const value = this.getAttribute('data-value');

            if (value === 'C') {
                currentInput = '';
                expression = '';
                displayPrevious.textContent = '';
                displayCurrent.textContent = '0';
                justEvaluated = false;
                return;
            }

            if (value === '=') {
                if (currentInput === '' && expression === '') return;

                if (['+', '-', '*', '/'].includes(expression.slice(-1))) {
                    displayCurrent.textContent = expression;
                    return;
                }

                try {
                    previousOperation = expression + ' = ' + eval(expression).toString();
                    expression = eval(expression).toString();
                } catch (e) {
                    expression = 'Error';
                }

                if (expression === 'NaN' || expression === 'Infinity' || expression === 'Error') {
                    expression = '';
                } else {
                    const historyItem = document.createElement('li');
                    historyItem.textContent = previousOperation;
                    historyList.appendChild(historyItem);
                }

                displayPrevious.textContent = previousOperation;
                displayCurrent.textContent = expression;

                currentInput = '';
                justEvaluated = true;
                return;
            }

            if (['+', '-', '*', '/'].includes(value)) {
                if (expression === '' || justEvaluated) {
                    justEvaluated = false;
                    expression = displayCurrent.textContent;
                }

                if (['+', '-', '*', '/'].includes(expression.slice(-1))) {
                    expression = expression.slice(0, -1);
                }

                expression += value;
                currentInput = '';
            } else {
                if (justEvaluated) {
                    expression = '';
                    justEvaluated = false;
                }

                if (['NaN', 'Infinity', 'Error'].includes(expression)) {
                    expression = '';
                }

                currentInput += value;
                expression += value;
            }

            displayPrevious.textContent = previousOperation;
            displayCurrent.textContent = expression.trim();
        });
    });

    clearHistoryButton.addEventListener('click', () => {
        historyList.innerHTML = '';
    });
});
