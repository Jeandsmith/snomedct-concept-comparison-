from flask import Flask, render_template, request, redirect

app = Flask(__name__, static_folder='public/')

# Only handle GET requests
@app.route('/')
def home():
    return render_template('main.html')

@app.route('/term-searh')
def term_search():
    print(request.args['search'])
    return redirect('/')