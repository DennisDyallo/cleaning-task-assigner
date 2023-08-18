import { AzureFunction, Context, HttpRequest } from "@azure/functions"

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');
    // const name = (req.query.name || (req.body && req.body.name));
    const responseMessage = formatAssignmentsToHTML(assignTasks())
    context.res = {
        // status: 200, /* Defaults to 200 */
        body: responseMessage,
        headers: {'content-type':'text/html'}
    };
};

type Person = "Dennis" | "Emelie" | "Nasti";
type Task = "Kitchen" | "Hallway" | "Living Room" | "Bathroom";

interface TaskAssignments {
    [Person: string]: Task[];
}

const tasks: Record<Task, Person[]> = {
    "Kitchen": ["Dennis", "Emelie", "Nasti"],
    "Hallway": ["Dennis", "Emelie", "Nasti"],
    "Living Room": ["Dennis", "Emelie", "Nasti"],
    "Bathroom": ["Dennis", "Emelie"]  // Only A and B clean the bathroom
};

function getRandomInt(max: number): number {
    return Math.floor(Math.random() * max);
}

function assignTasks(): TaskAssignments {
    let assignments: TaskAssignments = {
        "Dennis": [] ,
        "Emelie": [],
        "Nasti": []
    };

    for (let task in tasks) {
        let eligiblePersons = tasks[task as Task];
        let randomPerson = eligiblePersons[getRandomInt(eligiblePersons.length)];

        if (assignments[randomPerson].length < 2)
            assignments[randomPerson].push(task as Task);
    }

    // Ensure that two people are assigned tasks and one person rests
    let personsWithTasks = Object.keys(assignments).filter(person => assignments[person].length > 0);
    if (personsWithTasks.length !== 2) {
        return assignTasks();  // Recursively reassign if not two people
    }

    return assignments;
}

function formatAssignmentsToHTML(assignments: TaskAssignments): string {
    let breakString: string = "";
    let taskStrings: string[] = [];

    const happyEmojis = ['😁','😍','🥰','🤗']
    const sadEmojis = ['😓','😮','😪','😥']

    for (let person in assignments) {
        let emojiHappy= happyEmojis[getRandomInt(happyEmojis.length)]
        let emojiSad = sadEmojis[getRandomInt(sadEmojis.length)]

        if (assignments[person].length > 0) {
            taskStrings.push(`<li>${person} is assigned to clean: ${assignments[person].join(', ')} ${emojiSad}</li>`);
        } else {
            breakString = `<li><strong>${person} gets a break this week! ${emojiHappy}</strong></li>`;
        }
    }
    
    return `
        <html>
            <head>
                <title>Cleaning Schedule</title>
                <style>
                    ${Styles}
                </style>
            </head>
            <body>
                <ul>
                    <h2>Weekly Cleaning Assignments</h2>
                    ${breakString}
                    ${taskStrings.join('')}
                </ul>
            </body>
        </html>
    `;
}

const Styles = `@keyframes slideFadeIn {
    from {
        opacity: 0;
        transform: translateX(-50px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes pulsate {
    0% {
        font-size: 100%;
    }
    50% {
        font-size: 110%;  // Increase font size by 10%
    }
    100% {
        font-size: 100%;
    }
}

body {
    font-family: Arial, sans-serif;
    height: 100vh;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f4f4f4;
}

ul {
    list-style-type: none;
    padding-left: 0;
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    width: 400px;
    height: 165px;
    line-height: 20px;
}

li {
    animation: slideFadeIn 1s ease-out forwards;
    margin-bottom: 10px;
    opacity: 0;  // Start as transparent
}

li:nth-child(2) {
    line-height: 25px;
    animation: slideFadeIn 1.5s ease-out forwards, pulsate 2s infinite ease-in-out;
    animation-delay: 1.5s, 0s;  // Separate delay for each animation
}

li:nth-child(3) {
    animation-delay: 1s;  // Shortest delay
}

li:nth-child(4) {
    animation-delay: 0.5s;    // Middle delay
}`


export default httpTrigger;