# Práctica 4 – API de Gestio con GraphQL y MongoDB
## 1. Objetivo

Desarrollar el backend de una plataforma de gestión de proyectos colaborativos. El objetivo pedagógico es abandonar la arquitectura REST para implementar un servidor GraphQL que permita consultar grafos de datos complejos (Proyectos $\rightarrow$ Tareas $\rightarrow$ Usuarios) en una sola petición, gestionando la seguridad mediante JWT y Roles básicos.

---

## 2. Entrega

- Repositorio GitHub: URL del repositorio.
- Modalidad: Individual.
- Pull Request: Obligatorio crear PR desde feature/graphql-project-manager hacia develop.
- Ramas:
  - develop: Código estable.
  - feature/graphql-project-manager: Implementación de la práctica.

---

## 3 Modelos de Datos (MongoDB)

El esquema de datos es relacional por naturaleza. Se exigirá el uso correcto de Schema.Types.ObjectId y ref.

### **Users**

- _id: ObjectId
- username: String, único, requerido.
- email: String, único, requerido.
- password: String (hash bcrypt).
- createdAt: Date.

### **Projects**

- _id: ObjectId
- name: String, requerido.
- description: String.
- startDate: Date, requerido.
- endDate: Date, requerido (debe ser posterior a startDate).
- owner: ObjectId (Ref Users). El creador del proyecto.
- members: Array de ObjectId (Ref Users). Usuarios invitados al proyecto.

### **Tasks**

- _id: ObjectId
- title: String, requerido.
- projectId: ObjectId (Ref Projects).
- assignedTo: ObjectId (Ref Users), opcional.
- status: String (Enum: ["PENDING", "IN_PROGRESS", "COMPLETED"]), default PENDING.
- priority: String (Enum: ["LOW", "MEDIUM", "HIGH"]).
- dueDate: Date.

---

## 4 GraphQL Schema
## 4.1 Definiciones (Types & Inputs)
- Types: User, Project, Task, AuthPayload.

    - Nota: El tipo Project debe tener un campo tasks (array de Task) que no existe en la colección de MongoDB, sino que debe resolverse dinámicamente.
- Inputs: RegisterInput, LoginInput, CreateProjectInput, UpdateTaskInput.

## 4.2 Queries (Lectura)
- Públicas:
    Ninguna
- Autenticadas:
    - myProjects: Devuelve los proyectos donde el usuario es owner O es member.
    - projectDetails(projectId: ID!): Devuelve el proyecto completo, incluyendo sus miembros y todas sus tareas.
    - users: Devuelve lista de usuarios (para poder buscarlos e invitarlos a proyectos).

## 4.3 Mutations (Escritura)

- Auth (Públicas):
    - register(input: RegisterInput!): -> AuthPayload
    - login(input: LoginInput!): -> AuthPayload
- Gestión (Autenticadas):
    - createProject(input: CreateProjectInput!): Crea proyecto y asigna al usuario del contexto como owner.
    - updateProject(id: ID!, input: UpdateProjectInput!): Solo el owner puede editar.
    - addMember(projectId: ID!, userId: ID!): Agrega un usuario al array members. Solo el owner puede hacerlo.
    - createTask(projectId: ID!, input: TaskInput!): Crea una tarea. El usuario debe ser miembro o dueño del proyecto.
    - updateTaskStatus(taskId: ID!, status: TaskStatus!): Cambia el estado.
    - deleteProject(id: ID!): Borrado en cascada (borrar proyecto y sus tareas). Solo owner.
