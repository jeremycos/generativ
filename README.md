# Generativ

**Generativ** is a global metaprogramming library that generates code with reusable and sharable JSON scripts. Setup, upgrade or automate any code in a matter of seconds!

**Generativ cloud** is the public repertory containing all the scripts used for setup, correct bugs. They all have a unique identifier. It's available here : [Click here](https://github.com/jeremycos/jeremycos.github.io/tree/main/generativ).

**Generativ front** is a drag and drop builder used to setup in seconds a new React Project. You just add the components and the libraries, and it setup everything in one line.


## 1. Install the package globally

`npm install -g generativ`



## 2. Create a script and host it on the cloud

Example script ⬇️

This script is hosted here : [Click here](https://jeremycos.github.io/generativ/f790ec98-c57e-406b-9a6b-94f3a53ed09a.json)

```json
{
    "name": "insertRocket",
    "uid": "f790ec98-c57e-406b-9a6b-94f3a53ed09a",
    "description": "This script inserts three simple comments into two files",
    "instructions": [
        {
            "mode": "update_file",
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
            "mode": "update_file",
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
- First instruction has 2 actions : 1) it adds the **comment** `\n//Rocket setup\n` before the **code** `const reactions: any = {` into the **filepath** `comment.tsx` (be sure to be enough precise to target only one file. In that case, the name and extension was enough). And 2) it adds the **comment** `\n//Rocket setup\n` after the **code** `const reactions: any = {` with **a variable** text provided by the args 
`--params text=myvariabletoinsert`
- Second instruction adds the **comment** `\n//Rocket setup\n` before the the **code** `export function FloatingInput(props) {`  into the **filepath** `floating-input/floating-input.tsx`

## 3. Go to the root target of your project directory and execute the command line

For example, for our **myreactnativeproject**, we need to be into the root of this directory. So :

 **` cd myreactnativeproject`.**



Then we just execute this command line, providing the script source and the variables to modify : 

**`generativ --get myJsonUrl --params variable1="test"`**



If we have multiple variables to modify, we can separate them with ```+``` :

**`generativ --get myJsonUrl --params variable1="test"+variable2="test2"+variable3="test3"`**



Example : 

**`generativ --get https://jeremycos.github.io/generativ/withexecutecommand.json --params text="Un test simple"`**


## More to come (feel free to work on these new functionnalities ) :

- **New actions** : `remove_exact`✅, `replace_exact`✅,`add_first`✅, `add_last`✅, `add_between`✅, `replace_regex`(to correct)
- **Command line mode** : To mix file and command-line into an instruction script ✅ (but verify asynchronous)
- **Batch modification for file mode** : Now, the instructions are executed sequentially, but we want to execute it only if all files and references are founded (and are unique) before making the actions. So we need to check first if all files of instructions are present, and then we batch modify everything
- **Undo instruction command** : To remove the past instruction in on command line **`generativ --undo`**
- **Genarativ cloud**. A cloud space to host public scripts with a unique identifier + your own private reusable components or functionnalities. Each private generativ cloud space is linked to a private githubpages, so people can work easily on this repo. ✅ repo is available at https://jeremycos.github.io/generativ/+uid
- **Push command** : **`generativ --push myfile1+myfile2+myfile3 --public`** will generate a script for adding a new files into the `/*Gstart*/`and `/*Gend*/` comments, atttribute a unique identifier and host it on generativ cloud. **`generativ --push myfile1+myfile2+myfile3 --private`** will push create a script and host it on my private generativ cloud repositery


## Participate into this project and help us make the life of programmers better, faster and stronger!

Feel free to send us pull requests to improve this metaprogramming library.


