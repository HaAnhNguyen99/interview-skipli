
# Skipli - Coding Challenge

A brief description of what this project does and who it's for

### Installation

```shell
git clone https://github.com/koolkishan/chat-app-react-nodejs
cd chat-app-react-nodejs
```
Install the dependencies
```shell
cd /BE
npm i
cd ..
cd /FE
npm i --force
```

For Frontend.
```shell
npm run dev
```
For Backend.
```shell
node app.js
```

### Technologies
Frontend
* Framework: Vite (React + TypeScript)
* Styling: Tailwind CSS
Backend
* Server: Node.js
* Framework: Express, JWT Token
* Real-time Communication: Socket.IO


### Images
![image](https://github.com/user-attachments/assets/53668754-39d6-43be-ae8c-c0302db65736)
![image](https://github.com/user-attachments/assets/50bcbf3f-6713-4ada-8987-6eb7f88ca5ac)
![image](https://github.com/user-attachments/assets/d12973ed-f546-47b9-8e10-fc478aa2641d)



### Features
#### Authentication & Access Code

- Manager login via SMS verification code (OTP).
- Resend OTP code if needed.
- Verify OTP

#### Employee Management

- Add new employees (by manager).
- Send invitation emails for account setup to new employees.
- Employee account setup: Create username and password via setup link.
- Employee login.
- View details, update, and delete employees.

#### Task Management

- Create, update, delete, and view task details.
- Assign tasks to employees; manage tasks by employee.
- Update task status and information.
- List all tasks (filter by status/employee).
- Dashboard: View all tasks assigned to an employee.

#### Messaging

- Send and receive messages between accounts real time. (Manager and Employees)


