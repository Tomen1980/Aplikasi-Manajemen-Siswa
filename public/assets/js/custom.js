const globalvar = {
    url:`http://localhost:3000`
}

const deleteStudent=(btn)=>{
    const student = btn.parentNode.querySelector("[name = studentId]").value
    const csrf = btn.parentNode.querySelector("[name = _csrf]").value
    const studentElement = btn.closest("tr")
    let studen = document.getElementById("table")
    let parent = studen.parentNode
    let helper = document.createElement("div")
    fetch("/student-delete/"+student,{
        method : "DELETE",
        headers:{
            "csrf-token" : csrf
        }
    })
    .then((result)=>{
        // console.log(data.message)
        return result.json()
    })
    .then((data)=>{
        studentElement.parentNode.removeChild(studentElement)
        helper.innerHTML = `
            <div id="message" class="alert alert-info" role="alert">
                ${data.message}
            </div>;
        `
        while(helper.firstChild){
            parent.insertBefore(helper.firstChild,studen)
            removeElement()
        }
        
    })
    .catch((err)=>{
        console.log(err)
    })
}

const removeElement = () =>{
    setTimeout(()=>{
        const element = document.getElementById("message");
        element.parentNode.removeChild(element)
    },2000)
}

const assessment = io.connect(globalvar.url);
    assessment.on("assessment",(data)=>{
            let table = document.getElementById("table")
            // let parent = table.parentNode
            let tablerow = document.createElement("tr")
            tablerow.innerHTML = `<td class="middle">
                                    <div class="media">
                                        <div class="media-left">
                                            <a href="#">
                                                <img class="media-object"
                                                    src="${data.assessment.student.Image}"
                                                    height="100px" width="100px" alt="...">
                                            </a>
                                        </div>
                                    <div class="media-body">
                                        <address>
                                                Class : ${data.assessment.student.classs}<br>
                                                Name Student : ${data.assessment.student.name}<br>
                                                Gender :  ${data.assessment.student.gender}<br>
                                                Nik : ${data.assessment.student.nik}
                                        </address>
                                    </div>
                                    <div class="media-body">
                                        <address>
                                                Score : ${data.assessment.score}
                                        </address>
                                    </div>
                                </div>
                            </td>
                            <td width="100" class="middle">
                                    <div>
                                        <a href="/assessment-edit/${data.assessment.id}?edit=true" class="btn btn-circle btn-default btn-xs" title="Edit">
                                            <i class="fas fa-pencil-alt"></i>
                                        </a>
                                    </div>
                                </td>`
                table.insertAdjacentElement("afterbegin",tablerow)

    })

const socket = io.connect(globalvar.url);
    socket.on("create",(data)=>{
        if(data.action === "create"){
            let table = document.getElementById("table")
            // let parent = table.parentNode
            let tablerow = document.createElement("tr")
            tablerow.innerHTML = `<td class="middle">
                                    <div class="media">
                                    <div class="media-left">
                                        <a href="#">
                                        <img class="media-object" src="${data.student.Image}" height="100px" width="100px" alt="...">
                                        </a>
                                    </div>
                                    <div class="media-body">
                                        <address>
                                            <b>Name Student</b>          :  ${data.student.name}<br>
                                            <b>Gender</b>                :  ${data.student.gender}<br>
                                            <b> Address </b>             :  ${data.student.Address}<br>
                                            <b> Class </b>               :  ${data.student.classs}<br>
                                            <b> Nik </b>                 :  ${data.student.nik}
                                        </address>
                                    </div>
                                    </div>
                                </td>
                                <td width="100" class="middle">
                                    <div>
                                    <a href="/student-list/${data.student.id}?edit=true" class="btn btn-circle btn-default btn-xs" title="Edit">
                                        <i class="fas fa-pencil-alt"></i>
                                    </a>
                                    </a>
                                        </div>
                                </td>`
            table.insertAdjacentElement("afterbegin",tablerow)
        }
    })