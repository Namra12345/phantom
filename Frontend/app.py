from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# ------------------ Database Connection ------------------
def get_db_connection():
    return mysql.connector.connect(
        host="localhost",       
        user="root",            
        password="WJ28@krhps",  
        database="phantom"
    )

# ------------------ AUTH ROUTES ------------------
@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    name = data.get("name")
    email = data.get("email")
    password = generate_password_hash(data.get("password"))

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("INSERT INTO users (name, email, password_hash) VALUES (%s, %s, %s)",
                       (name, email, password))
        conn.commit()
        return jsonify({"message": "User registered successfully"}), 201
    except mysql.connector.IntegrityError:
        return jsonify({"error": "Email already exists"}), 400
    finally:
        cursor.close()
        conn.close()

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE email=%s", (email,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()

    if user and check_password_hash(user["password_hash"], password):
        return jsonify({"message": "Login successful", "user_id": user["user_id"]})
    return jsonify({"error": "Invalid credentials"}), 401

# ------------------ USER ROUTES ------------------
@app.route('/api/users', methods=['GET'])
def get_users():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT user_id, name, email, created_at FROM users")
    users = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(users)

@app.route('/api/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT user_id, name, email, created_at FROM users WHERE user_id=%s", (user_id,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()
    return jsonify(user) if user else (jsonify({"error": "User not found"}), 404)

# ------------------ PROJECT ROUTES ------------------
@app.route('/api/projects', methods=['POST'])
def create_project():
    data = request.json
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO projects (name, description, priority, duration, tags, image_url, created_by)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
    """, (data["name"], data["description"], data["priority"], data["duration"], 
          data["tags"], data["image_url"], data["created_by"]))
    conn.commit()
    project_id = cursor.lastrowid
    cursor.close()
    conn.close()
    return jsonify({"message": "Project created", "project_id": project_id}), 201

@app.route('/api/projects', methods=['GET'])
def get_projects():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM projects")
    projects = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(projects)

# ------------------ PROJECT MEMBER ROUTES ------------------
@app.route('/api/projects/<int:project_id>/members', methods=['POST'])
def add_member(project_id):
    data = request.json
    user_id = data["user_id"]
    role = data.get("role", "Member")

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO project_members (project_id, user_id, role) VALUES (%s, %s, %s)",
                   (project_id, user_id, role))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"message": "Member added"}), 201

@app.route('/api/projects/<int:project_id>/members', methods=['GET'])
def list_members(project_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT pm.id, u.name, u.email, pm.role
        FROM project_members pm
        JOIN users u ON pm.user_id = u.user_id
        WHERE pm.project_id=%s
    """, (project_id,))
    members = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(members)

@app.route('/api/projects/<int:project_id>/members/<int:user_id>', methods=['DELETE'])
def remove_member(project_id, user_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM project_members WHERE project_id=%s AND user_id=%s",
                   (project_id, user_id))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"message": "Member removed"})

# ------------------ TASK ROUTES ------------------
@app.route('/api/projects/<int:project_id>/tasks', methods=['POST'])
def create_task(project_id):
    data = request.json
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO tasks (project_id, title, description, assignee_id, status, priority, due_date, image_url)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    """, (project_id, data["title"], data["description"], data.get("assignee_id"),
          data.get("status", "To-Do"), data.get("priority", "Medium"), 
          data.get("due_date"), data.get("image_url")))
    conn.commit()
    task_id = cursor.lastrowid
    cursor.close()
    conn.close()
    return jsonify({"message": "Task created", "task_id": task_id}), 201

@app.route('/api/projects/<int:project_id>/tasks', methods=['GET'])
def get_tasks(project_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM tasks WHERE project_id=%s", (project_id,))
    tasks = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(tasks)

@app.route('/api/tasks/<int:task_id>', methods=['GET'])
def get_task(task_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM tasks WHERE task_id=%s", (task_id,))
    task = cursor.fetchone()
    cursor.close()
    conn.close()
    return jsonify(task) if task else (jsonify({"error": "Task not found"}), 404)

@app.route('/api/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    data = request.json
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE tasks 
        SET title=%s, description=%s, assignee_id=%s, status=%s, priority=%s, due_date=%s, image_url=%s
        WHERE task_id=%s
    """, (data["title"], data["description"], data.get("assignee_id"), data.get("status"),
          data.get("priority"), data.get("due_date"), data.get("image_url"), task_id))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"message": "Task updated"})

@app.route('/api/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM tasks WHERE task_id=%s", (task_id,))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"message": "Task deleted"})

# ------------------ COMMENT ROUTES ------------------
@app.route('/api/projects/<int:project_id>/comments', methods=['POST'])
def add_comment(project_id):
    data = request.json
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO comments (project_id, user_id, message)
        VALUES (%s, %s, %s)
    """, (project_id, data["user_id"], data["message"]))
    conn.commit()
    comment_id = cursor.lastrowid
    cursor.close()
    conn.close()
    return jsonify({"message": "Comment added", "comment_id": comment_id}), 201

@app.route('/api/projects/<int:project_id>/comments', methods=['GET'])
def list_comments(project_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT c.comment_id, c.message, c.created_at, u.name 
        FROM comments c
        JOIN users u ON c.user_id = u.user_id
        WHERE c.project_id=%s
    """, (project_id,))
    comments = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(comments)

# ------------------ ENHANCEMENTS ------------------
@app.route('/api/projects/<int:project_id>/progress', methods=['GET'])
def project_progress(project_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT status, COUNT(*) as count FROM tasks WHERE project_id=%s GROUP BY status", (project_id,))
    stats = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(stats)

@app.route('/api/tasks/my', methods=['GET'])
def my_tasks():
    user_id = request.args.get("user_id")
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM tasks WHERE assignee_id=%s", (user_id,))
    tasks = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(tasks)

@app.route('/api/notifications', methods=['GET'])
def notifications():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT t.task_id, t.title, t.due_date, u.name as assignee
        FROM tasks t
        LEFT JOIN users u ON t.assignee_id = u.user_id
        ORDER BY t.due_date ASC
        LIMIT 10
    """)
    notifications = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(notifications)

# ------------------ RUN APP ------------------
if __name__ == '__main__':
    app.run(debug=True)
