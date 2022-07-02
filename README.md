# Generativ

**Generativ** is a lightweight global library that generates code with resusable and sharable scripts. Setup, upgrade or automate any code in a matter of seconds!


## 1. Install the package globally

`npm install -g generativ`



## 2. Create a script and host it on the cloud

Example script ⬇️

This script is hosted here : [Click here](https://storage.googleapis.com/rocketsetup-2ded0.appspot.com/insertRocketTwoFilesAdvancedModified.json)

```json
{
    "name": "insertRocket",
    "uid": "TETEFEFkfekfkelfkelfelkdkckvekfeueregek",
    "description": "This script inserts three simple comments into two files",
    "instructions": [
        {
            "mode": "file",
            "file": "comment.tsx",
            "actions": [
                {
                    "type": "add_before",
                    "reference": "const reactions: any = {",
                    "code": "\n//Rocket setup\n",
                    "isUnique": true
                },
                {
                    "type": "add_after",
                    "reference": "const reactions: any = {",
                    "code": "\n//Rocket setup %text\n",
                    "variables": [
                        {
                            "name": "text",
                            "defaultValue": "Texte à insérer"
                        }
                    ],
                    "isUnique": true
                }
            ]
        },
        {
            "mode": "file",
            "file": "floating-input/floating-input.tsx",
            "actions": [
                {
                    "type": "add_before",
                    "reference": "export function FloatingInput(props) {",
                    "code": "\n//Rocket setup\n",
                    "isUnique": true
                }
            ]
        }
    ]
}
```

This script has 2 instructions : 
- First instruction has 2 actions : 1) it adds the **comment** "\n//Rocket setup\n" before the **code** "const reactions: any = {" into the **filepath** "comment.tsx" (be sure to be enough precise to target only one file. In that case, the name and extension was enough). And 2) it adds the **comment** "\n//Rocket setup\n" after the **code** "const reactions: any = {" with **a variable** text provided by the args 
`--params text=myvariabletoinsert`
- Second instruction adds the **comment** "\n//Rocket setup\n" before the the **code** "export function FloatingInput(props) {"  into the **filepath** "floating-input/floating-input.tsx"

## 3. Go to the root target of your project directory and execute the command line

For example, for our **myreactnativeproject**, we need to be into the root of this directory. So in "myreactnativeproject". 



Then we just execute this command line, providing the script source and the variables to modify : 

`generativ --url myJsonUrl --params variable1="test"`



If we have multiply variables to modify, we can separate them with ```+``` :

`generativ --url myJsonUrl --params variable1="test"+variable2="test2"+variable3="test3"`



With the example above : 

`generativ --url https://storage.googleapis.com/rocketsetup-2ded0.appspot.com/insertRocketTwoFilesAdvancedModified.json --params text="Un test simple"`


