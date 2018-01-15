const CopyPage = require("../libs/tasks/copyPage/CopyPageTask.js").CopyPage;

const copy = new CopyPage({copy:"C:\\Users\\Javier Pérez Ruiz\\Projects\\Cursos\\conversacion-en-digital\\course\\sco1186\\pages\\7223",to:"C:\\Users\\Javier Pérez Ruiz\\Projects\\haztivity\\cli\\test\\course\\sco1221\\pages\\1111",force:true});
copy.run();