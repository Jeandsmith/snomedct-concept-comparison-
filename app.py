from flask import Flask, render_template, request, jsonify, send_from_directory, session
import db_requests as dbcon
import gens

app = Flask(__name__)

# Handle home page


@app.route("/")
def home():
    return render_template("home.html")

# Handles user requests


@app.route("/term-search", methods=["GET", "POST"])
def term_search():
    if request.method == 'GET':
        user_search = request.args.get('search')
        query_result = dbcon.get_terms(user_search)
        term_sim_res = gens.gen_query_term_sim(query_result, user_search)
        return jsonify(term_sim_res)


@app.route("/filter")
def filter():
    res = dbcon.filter_terms(request.args.get("tag"),
                             request.args.get("query"))
    sim_res = gens.gen_query_term_sim(res, request.args.get("query"))
    return jsonify(sim_res)


@app.route("/descriptions")
def descriptions():
    conceptId = request.args.get('id')
    ans = dbcon.get_alt_terms(conceptId)
    rels = dbcon.get_concept_rels(conceptId)
    return jsonify(search_result=ans, attr_rels=rels)


@app.route('/feedback', methods=["GET", "POST"])
def feedback():
    if request.method == "POST":
        data_submitted = request.form
        dbcon.postFeedback(data_submitted)
        return ('', 204)


@app.route('/feedback/count')
def feedback_count():
    conceptId = request.args['conceptId']
    feedback_count = dbcon.feedbackCount(conceptId)
    return jsonify(feedback_count)


@app.route('/descriptions/card-concept-comparison', methods=['POST', 'GET'])
def card_concept_comparison():
    if request.method == "POST":
        c1 = request.form.get('concept_1')
        c2 = request.form.get('concept_2')
        sim = gens.compare_concepts(c1, c2)
        return str(sim)


@app.route('/children-rels', methods=['GET', 'POST'])
def children_concepts():
    concept_id = request.args['conceptId']

    print(concept_id)
    children = dbcon.get_children(concept_id)
    return jsonify(children)

# Route to the the parent concepts of the clicked concept
@app.route('/descriptions/parent-rels')
def parents_rels():
    conceptId = request.args['conceptId']
    parents = dbcon.get_parent(conceptId)

    return jsonify(parents)