from flask import Flask, render_template, request, jsonify, send_from_directory, session
import db_requests as dbreq
import gens

app = Flask(__name__)

# Handle home page
@app.route("/")
def home():
    return render_template("template.html")

# Handles user requests
@app.route("/term-search", methods=["GET", "POST"])
def term_search():
    if request.method == 'GET':
        t1 = request.args.get('search')
        ans = dbreq.get_terms(t1)
        res = gens.gen_query_term_sim(ans, t1)
        return jsonify(res)


@app.route("/filter")
def filter():
    res = dbreq.filtered_terms(request.args.get(
        "tag"), request.args.get("query"))
    sim_res = gens.gen_query_term_sim(res, request.args.get("query"))
    return jsonify(sim_res)


@app.route("/descriptions")
def descriptions():
    conceptId = request.args.get('id')
    query = request.args.get('query')
    ans = dbreq.get_alt_terms(conceptId)
    res = gens.gen_sym_sim(ans, query)
    return jsonify(res)
