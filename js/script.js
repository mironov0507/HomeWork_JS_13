class User {
    constructor(contactData){
        this.data = {};
        [
            this.data['name'],
            this.data['email'],
            this.data['phone'],
            this.data['id']
        ] = contactData
    }
        get info() {
            return this.data
        }

        set info(contactData){
            [
                this.data['name'],
                this.data['email'],
                this.data['phone'],
                this.data['id']
            ] = contactData
        } 
}

class Contacts{
    constructor(){
        this.contactList = [];
    }

    add(contactData){
        this.contactList.push(new User(contactData))
    }

    show(){
        let infoContact = [];
        this.contactList.forEach(function(element){
            infoContact.push(element.info)
        })

        return infoContact
    }

    remove(id){
        this.contactList.forEach((element, index)=>{
            if(element.data.id == id){
                this.contactList.splice(index,1);
            }
        })
        if(this.contactList.length > 0){
            this.storage = this.contactList
        }else{
            this.getData();
        }
        
        return this.contactList
    }

    change(id){
        this.contactList.forEach((element)=>{
            if(element.data.id == id){
                let inputChange = document.createElement('div');
                inputChange.innerHTML =`<div class="change_text">
                
                <input type="text" name="ch_name" value="${element.data['name']}"><br>
                <input type="text" name="ch_email" value="${element.data['email']}"><br>
                <input type="text" name="ch_phone" value="${element.data['phone']}"><br>
                <button class='ok' name="add">Ok</button>
                
                </div>`
    
                document.body.appendChild(inputChange);

                let btnOk = document.querySelector('.ok');
             
      
                btnOk.addEventListener('click', ()=>{
                    let ch_name = document.querySelector('input[name="ch_name"]').value;
                    let ch_email = document.querySelector('input[name="ch_email"]').value;
                    let ch_phone = document.querySelector('input[name="ch_phone"]').value;

                    let changeData = [];
                    changeData.push(ch_name, ch_email, ch_phone, id);

                    element.info = changeData

                    inputChange.remove();

                    this.storage = this.contactList
                    
                    this.onShow()
                })
            }
        })
        this.storage = this.contactList
        return this.contactList
    }  
}                                                                                                         

class ContactApp extends Contacts{
    constructor(){
        super()
        const getCookie = function(name){
            let matches = document.cookie.match(new RegExp(
                "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
              ));
              return matches ? decodeURIComponent(matches[1]) : undefined;
        }
        this.addEvent();
        if(!getCookie('storageExpiration')){
            window.localStorage.clear();
            this.contactList = []
        }else{
            ((!this.storage) || this.storage.length == 0)? (
                this.getData()
             ) : (
                this.contactList = this.storage.map(el => new User(Object.values(el.data))),
                this.onShow()
             );
        }
    }

    addEvent(){

        let btn = document.querySelector('button[name="add"]');
       
        btn.addEventListener('click',()=>{
            let id = Date.now();
            this.onAdd(id).onShow()
        })
    }

    onAdd(id){

        let name = document.querySelector('input[name="name"]').value;
            let email = document.querySelector('input[name="email"]').value;
            let phone = document.querySelector('input[name="phone"]').value;

            let infoData = [];
            infoData.push(name, email, phone, id)

            this.add(infoData);
            this.storage = this.contactList
            return this
    }

    onShow(){

        let html = '';
            this.show().forEach((element)=>{
                html +=`Имя: ${element.name}; Эл. почта: ${element.email}; Телефон: ${element.phone}; <button class='delete' id = '${element.id}'>Delete</button><button class='change' id = '${element.id}'>Change</button><br>`
            })
            document.querySelector('.list').innerHTML = html;
            document.querySelector('input[name="name"]').value = '';
            document.querySelector('input[name="email"]').value = '';
            document.querySelector('input[name="phone"]').value = '';

        let btnDelete = document.querySelectorAll('.delete');
             
        btnDelete.forEach((element)=>{
            element.addEventListener('click', (event)=>{

                this.onRemove(event.target.id).onShow()
            })
        })

        let btnChange = document.querySelectorAll('.change');
             
        btnChange.forEach((element)=>{
            element.addEventListener('click', (event)=>{

                this.onChange(event.target.id).onShow()
            })
        })
        
    }

    onRemove(id){
        this.remove(id)
        return this
    }

    onChange(id){
        this.change(id)
        return this
    }

    get storage(){
        return JSON.parse(localStorage.getItem('contacts'))

    }

    set storage(infCont){
        localStorage.setItem('contacts', JSON.stringify(infCont));
        document.cookie = 'storageExpiration = 10day; max-age=864000';
    }

    getData(){
        let superThis = this;

        const getArray = async function(){
            let url = 'https://jsonplaceholder.typicode.com/users'

            let response = await fetch(url);
            let data = await response.json();

            let dataA = data.map(el => new User([el.name, el.email, el.phone, el.id]));

            superThis.contactList = dataA;

            superThis.storage = superThis.contactList;

            superThis.onShow()

        }();
       
    }

}

let app = new ContactApp();

