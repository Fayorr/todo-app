Welcome to Your Task Manager App

Deployed Here => https://my-todo-frontend-l8n8.onrender.com/

ERD Diagram Here => https://drawsql.app/teams/testdb-15/diagrams/todo-app

Functionalities:
1. Ability to Register and Login so your tasks are only seen by you.
2. Ability to Add tasks.
3. Ability to Delete tasks.
4. Ability to Edit tasks.
5. Ability to Mark As Completed.
6. Ability to Logout.

Challenges:
1. I struggled with connecting the backend and frontend using render as it was monorepo. I had to rewrite my cookies definitions and make my cors functional. I eventually resolved it using reverse proxies (This tricks the browser into thinking it is only talking to Site A, while Site A secretly forwards messages to Site B in the background.) implemented using the Redirects/Rewrites rule on render.com.

2. I created ejs templates to render on the frontend but i took up the challenge to use another template view react.js.