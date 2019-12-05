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
     *  -description : a function that takes care of the dealing with displaying error for radio btns and check buttons, will recieve the input field as a parameter
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
    constructor({form=null,normalShowError=null,groupShowError=null,fileHandler,pwd1=null,pwd2=null,template=null})
    {
        this.form = form;        
        this.normalshowError = normalShowError;
        this.groupShowError = groupShowError;
        this.fileHandler = fileHandler;
        this.fields = {};
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

        if(canSubmit)
        {
           // this.form.submit();
            console.log(this.fields);
            
            console.log("submit");

        }    
        
        else
        {
            console.log(this.fields);
            
            console.log("failed");
        }

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

                  if(this.fileHandler) this.fileHandler(file,inputField);
                } 
                else 
                {
                  this.fields[name] = false;
                  if(this.normalshowError) this.normalshowError(inputField);
                  
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
                    if(this.groupShowError)  this.groupShowError(inputField);                   
                    
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
                  if(this.groupShowError) this.groupShowError(inputField);
                  
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

    checkPasswordMatch()
    {

    }



}

const g = document.querySelector('form');

const h = new FormChecker({ form:g });




