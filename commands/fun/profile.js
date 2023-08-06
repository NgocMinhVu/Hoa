const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const Canvas = require('@napi-rs/canvas');
const { request } = require('undici');

const applyText = (canvas, text) => {
    const context = canvas.getContext('2d');

    let fontSize = 70;

    do {
        context.font = `${(fontSize -= 10)}pz sans-serif`;
    } while (context.measureText(text).width > canvas.width - 300);

    return context.font;
};

module.exports = {
    category: 'fun',
    data: new SlashCommandBuilder()
        .setName('profile')
        .setDescription('Placeholder'),
    async execute(interaction) {
        // create a 700x250 pixel canvas and get its context
        // the context will be used to modify the canvas
        const canvas = Canvas.createCanvas(700, 250);
        const context = canvas.getContext('2d');

        const background = await Canvas.loadImage('./wallpaper.jpg');

        context.drawImage(background, 0, 0, canvas.width, canvas.height);

        context.strokeStyle = '#0099ff';
        context.strokeRect(0, 0, canvas.width, canvas.height);

        context.font = '28px sans-serif';
        context.fillStyle = '#23395d';
        context.fillText('Profile', canvas.width / 2.5, canvas.height / 3.5);

        context.font = applyText(canvas, interaction.member.displayName);
        context.fillStyle = '#23395d';
        context.fillText(
            interaction.member.displayName,
            canvas.width / 2.5,
            canvas.height / 1.8
        );

        // pick up the pen
        context.beginPath();
        // start the arc to form a circle
        context.arc(125, 125, 100, 0, Math.PI * 2, true);
        // put the pen down
        context.closePath();
        // clip off the region
        context.clip();

        // using undici to make HTTP requests for better performance
        const { body } = await request(
            interaction.user.displayAvatarURL({ extension: 'jpg' })
        );
        const avatar = await Canvas.loadImage(await body.arrayBuffer());
        // const avatar = await Canvas.loadImage(await body.arrayBuffer());
        context.drawImage(avatar, 25, 25, 200, 200);

        // user Attachment class structure to process the file
        const attachment = new AttachmentBuilder(await canvas.encode('png'), {
            name: 'profile-image.png'
        });
        interaction.reply({ files: [attachment] });
    }
};
