from flask.app import Flask
from flask.templating import render_template
from werkzeug.utils import redirect

__author__ = 'Sarike'

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
