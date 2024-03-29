/*

    Author : Okafor Irene
    Email : okaforirenen@gmail.com
    Github : https://github.com/Irene-24

    2019

*/


class FormChecker
{
    /**
     * 
     * @param {Object} options
     * Possible Options
     * form:
     *  -isRequired:true
     *  -description : The HTMLFormElement
     * 
     * normalShowError:
     *  -isRequired:false
     *  -description : a function that takes care of the dealing with displaying error for text fields, text areas, select will recieve the input field as a parameter
     * 
     * groupShowError:
     *  -isRequired:false
     *  -description : a function that takes care of the dealing with displaying error for radio btns and check buttons, will recieve the input field and form as a parameter
     * 
     * pwd1,pwd2
     * -isRequired: false
     * -description: When provided with the id of two password fields, this checks that both are equal.
     * 
     * template
     * -isRequired : false
     * -description: An Object of  that takes the format for validating text fields, text areas, select e,g
     * {
     *      phone: 
                {
                    exp: /^\d{7,}$/,
                    msg:
                        "Invalid phone number.Phone number must be 13 digits long and start with +234"
                },
            email: 
                {
                    exp: /[a-z0-9_-]+[a-z0-9_.-]*[a-z0-9_]+@[a-z0-9-]+[a-z0-9_.-]*[a-z0-9]+/i,
                    msg:
                        "Email must contain @ and should contain only letters, numbers, underscores and dots "
                },   
     * }
     * 
     */
    constructor({form,normalShowError,fileErrorHandler,groupShowError,fileHandler,pwd1Id,pwd2Id,template})
    {
        this.form = form;        
        this.normalshowError = normalShowError;
        this.groupShowError = groupShowError;
        this.fileHandler = fileHandler;
        this.fileErrorHandler = fileErrorHandler;
        this.fields = {};
        this.pwd1Id = pwd1Id;
        this.pwd2Id = pwd2Id;
        this.template = template ||
        {
            general: 
            {
              exp: /./i,
              msg: "Field cannot be blank"
            },
            phone: 
            {
              exp: /^\d{7,}$/i,
              msg:
                "Invalid phone number.Phone number must be 13 digits long and start with +234"
            },
    
            email: 
            {
              exp: /[a-z0-9_-]+[a-z0-9_.-]*[a-z0-9_]+@[a-z0-9-]+[a-z0-9_.-]*[a-z0-9]+/i,
              msg:
                "Email must contain @ and should contain only letters, numbers, underscores and dots "
            }
        }
        ;

      

        const formFields = this.form.querySelectorAll('[data-field]');

        formFields.forEach( input =>
            {
              
                if(this.fields[input.name] === undefined)
                {
                    this.fields[input.name] = false;
                } 
                
                if(input.type === 'file' && this.fileHandler)
                {
                  input.addEventListener('change',this.fileHandler);
                }

            });

        this.form.addEventListener( 'submit', e => this.submit(e) );

    }

    submit(event)
    {
        event.preventDefault();
        let canSubmit = true;

        for (const field in this.fields) 
        {
            const input = this.form.querySelector(`[name="${field}"]`);
            canSubmit = this.validate(input) && canSubmit;
        }

        if(this.pwd1Id && this.pwd2Id)
        {  
          canSubmit =  this.checkPasswordMatch(this.form.querySelector(`#${this.pwd1Id}`),this.form.querySelector(`#${this.pwd2Id}`))  && canSubmit ;
        }

        if(canSubmit)
        {
           this.form.submit();
            // console.log(this.fields);
            
            // //just because i can
            // console.log("%cForm submission successful",'background-color:green;margin:0;color:#fff;padding:10px;test-align:center');

        }    
        
        // else
        // {
        //     console.log(this.fields);
            
        //      //just because i can
        //     console.log("%cForm submission failed",'background-color:salmon;margin:0;color:#fff;padding:10px;test-align:center');
        // }

    }

    validate(inputField)
    {
        let name = inputField.name;
        
        switch (inputField.type) 
        {
            case "file":
                if (inputField.files.length > 0) 
                {
                  this.fields[name] = true;
                } 
                else 
                {
                  this.fields[name] = false;
                  if( this.fileErrorHandler) this.fileErrorHandler(inputField);
                  
                }
                
                return this.fields[inputField.name];

           case "checkbox":  
                let checkCount = 0;
                const checks = this.form.querySelectorAll(`[name="${name}"]`);   

                checks.forEach(c => 
                  {
                    if (c.checked) 
                    {
                      checkCount += 1;
                    }
                  });

                  if (checkCount < 1) 
                  {
                    this.fields[name] = false;
                    if(this.groupShowError)  this.groupShowError(inputField,this.form);                   
                    
                  }
                  else
                  {
                    this.fields[name] = true;
                  }

                  return this.fields[name];

            case "radio":
                let radios = this.form.querySelectorAll(`[name="${name}"]`);
                let none = true;

                for (let radio = 0; radio < radios.length; radio++) 
                {
                    if (radios[radio].checked) 
                    {
                      none = false;
                      this.fields[name] = true;
                      break;                     
                    }                   
                }

                if (none) 
                {
                  this.fields[name] = false;
                  if(this.groupShowError) this.groupShowError(inputField,this.form);
                  
                }


                return this.fields[name];    
                
            default:
                const value = inputField.value
                  .trim()
                  .toString()
                  .toLowerCase();

                const type = inputField.dataset.field;
        
                if (this.template[type].exp.test(value)) 
                {
                  this.fields[name] = true;
                } 
                
                else 
                {
                  this.fields[name] = false;

                  if(this.normalshowError) this.normalshowError(inputField,this.template[type].msg)
                  
                }
        
                return this.fields[name];  

        }

    }

    checkPasswordMatch(field1,field2)
    {
        const nameA = field1.name;
        const nameB = field2.name;

        if(field1.value !== field2.value)
        {
          this.fields[nameA] = false;
          this.fields[nameB] = false;

          if(this.normalshowError)
          {
            
            this.normalshowError(field1);
            this.normalshowError(field2);
          }
         
        }
        else
        {
            this.fields[nameA] = true;
            this.fields[nameB] = true;
        }

        return this.fields[nameA];
    }



}

//TESTING THE CLASS BY CREATING TWO INSTANCES
const formA = new FormChecker({ form:document.querySelector('#formA'), groupShowError:groupA,  normalShowError:normalShowErrorA,fileHandler:myFileHandler, fileErrorHandler:myFileErrorHandler }); 

const formB = new FormChecker({ groupShowError:groupB, form:document.querySelector('#formB'), pwd1Id:'password1', pwd2Id:'password2', normalShowError:normalShowErrorB });

function normalShowErrorA(input,msg="Invalid field")
{
     input.style.border = "1px solid red";
}

function normalShowErrorB(input,msg="Invalid field")
{
     input.style.background = "salmon";

}

function myFileHandler(event)
{
  
  const input = event.target;
  const span = input.nextElementSibling;
  if (input.files.length > 0) 
  {
    const file = input.files[0];
    span.textContent = file.name;
    span.style.color="blue";
  }
}

function myFileErrorHandler(field)
{
    field.style.border = "2px solid orange";
}

function groupA(input,form)
{
   const name = input.name;
  if(input.type === "checkbox")
  {
      form.querySelectorAll(`[name="${name}"]`).forEach(el => el.parentElement.style.color = "salmon");
  }
  else
  {
    form.querySelectorAll(`[name="${name}"]`).forEach(el => el.parentElement.style.textDecoration= "underline");
  }

}


function groupB(input,form)
{
   const name = input.name;
  if(input.type === "checkbox")
  {
      form.querySelectorAll(`[name="${name}"]`).forEach(el => el.parentElement.style.color = "red");
  }
  else
  {
    form.querySelectorAll(`[name="${name}"]`).forEach(el => el.parentElement.style.textDecoration= "line-through");
  }

}







