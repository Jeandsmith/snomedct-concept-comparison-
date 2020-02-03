from flask import Flask, render_template, request

app = Flask(__name__)

# Defining a route
@app.route('/')
def home():
    return render_template('main.html')


@app.route('/search', methods=['GET', 'POST']) 
def search():
    # if request.method == 'POST':
    #     return render_template('process-query.html', search=request.form['search'])
    # else:
    #     return 'Not valid URL'

    return render_template('process-query.html', search=request.args['search']) 