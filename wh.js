const fs = require("fs");
const { WebhookClient, MessageEmbed } = require("discord.js");
// var webhookURL;

function initMCWebhookJSON() {
    var InitJSON = { "statusMessageID": "none", "membersMessageID": "none", "status": "1", "initialized": "true", "webhookURL": "" };
    fs.writeFileSync("./MCWebhook.json", JSON.stringify(InitJSON, null, 4));
    console.log("wrote json file")


}


function initialize(members, fileInit) {
    console.log("initializing");

    const wc = new WebhookClient({ url: webhookURL });


    var webhookData = JSON.parse(fs.readFileSync(".\\MCWebhook.json"));
    wc.send({ embeds: [(statusEmbedGenerator({ title: "The server is currently ONLINE", color: "00cc00" }))] }).then(msg => {
        webhookData.statusMessageID = msg.id.toString();
        fs.writeFileSync("./MCWebhook.json", JSON.stringify(webhookData, null, "  "));
    });
    wc.send({ embeds: [(statusEmbedGenerator({ title: "Noone's joined yet", color: "212e44" }))] }).then(msg => {
        webhookData.membersMessageID = msg.id.toString();
        fs.writeFileSync("./MCWebhook.json", JSON.stringify(webhookData, null, "  "));
        if (members != 0) {
            membersUpdate(members);
        }
    });
    console.log("initialized");

}



function statusON() {
    console.log("statusOn")
    embed = statusEmbedGenerator({ title: "The server is currently ONLINE", color: "00cc00" })
    const wc = new WebhookClient({ url: webhookURL });
    var statusMessageID = JSON.parse(fs.readFileSync(".\\MCWebhook.json")).statusMessageID;
    wc.editMessage(statusMessageID, { embeds: [embed] });
    embed = statusEmbedGenerator({ title: "Noone's joined yet", color: '212e44' })
    var membersMessageID = JSON.parse(fs.readFileSync(".\\MCWebhook.json")).membersMessageID;
    wc.editMessage(membersMessageID, { embeds: [embed] })
    console.log("statusOnned");
}

function statusOFF() {
    console.log("statusOFF");
    embed = statusEmbedGenerator({ title: "The server is currently OFFLINE", color: "cc0000" });
    const wc = new WebhookClient({ url: webhookURL });
    var statusMessageID = JSON.parse(fs.readFileSync(".\\MCWebhook.json")).statusMessageID;
    wc.editMessage(statusMessageID, { embeds: [embed] });
    embed = statusEmbedGenerator({ title: "The server is literally offline", color: 'bc644c' });
    var membersMessageID = JSON.parse(fs.readFileSync(".\\MCWebhook.json")).membersMessageID;
    wc.editMessage(membersMessageID, { embeds: [embed] });
    console.log("statusOffed")
}



function membersUpdate(members) {
    if (JSON.parse(fs.readFileSync('.\\MCWebhook.json')).status == '1') {
        var membersInt = parseInt(members)
        var title
        switch (membersInt) {
            case 0:
                title = `Noone is online..`
                break
            case 1:
                title = `There is one person playing`
                break
            default:
                title = `There are ${membersInt} people playing`
                break
        }
        embed = statusEmbedGenerator({ title: title, color: '4af1ff' })
        const wc = new WebhookClient({ url: webhookURL })
        var membersMessageID = JSON.parse(fs.readFileSync('.\\MCWebhook.json'))
            .membersMessageID
        wc.editMessage(membersMessageID, { embeds: [embed] })
    }
}


function statusEmbedGenerator({ title, desc, color } = {}) {
    embed = new MessageEmbed();
    if (typeof color == 'string') {
        embed.setColor(color)
    }
    if (typeof desc == 'string') {
        embed.setDescription(desc)
    }
    if (typeof title == 'string') {
        embed.setTitle(title);
    }
    return (embed);
}

function main() {
    switch (process.argv[2].toString()) {
        case ("init"):
            console.log(process.argv[2]);
            initialize(process.argv[3]);

            break;
        case ("enable"):
            console.log(process.argv[2]);
            statusON();
            break;
        case ("disable"):
            console.log(process.argv[2]);
            statusOFF();
            break;
        case ("members"):
            console.log(process.argv);
            membersUpdate(process.argv[3])
            break;
        default:
            console.log("argument not found");
            console.log(process.argv);
    }
}



try {
    //file read
    if (process.argv.length < 3) {
        throw 0;
    } else if (process.argv[2].length == 0) {
        throw 0;
    }

    const webhookData = fs.readFileSync(".\\MCWebhook.json");
    console.log("successfully read file")
    console.log((JSON.stringify(JSON.parse(webhookData))))
    try {
        //json parse
        webhookURL = JSON.parse(webhookData).webhookURL;
        console.log("successfully read URL")
        console.log(webhookURL)
        try {
            //url check
            console.log("checking url validity")
            if ((webhookURL) == 0) {
                console.log("error 1")
                throw (1)
            } else if (!(webhookURL.includes("discord.com"))) {
                console.log("error 2")
                throw (2)
            } else {
                console.log("executing main")
                main()
            }

        } catch (error) {
            switch (error) {
                //url check
                case 1:
                    console.log("Please set the discord webhook URL in MCWebhooks.json")
                    break;
                case 2:
                    console.log("Please set a valid webhook URL in MCWebhooks.json")
                    break;
                default:
                    console.log(error);
                    break;
            }

        }

    } catch (error) {
        //json parse
        console.log(error);
        console.log("JSON parse failed, writing new file");
        initMCWebhookJSON();
    }
} catch (error) {
    //args
    if (error == 0) {
        console.log("no args, exiting")
        process.exit(1);
    } else {
        //file read
        console.log(error)
        console.log("file read failed, writing new file")
        initMCWebhookJSON();
    }
}