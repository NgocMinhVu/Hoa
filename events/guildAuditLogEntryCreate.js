const { AuditLogEvent, Events } = require('discord.js');

module.exports = {
    name: Events.GuildAuditLogEntryCreate,
    async execute(auditLog) {
        const {
            action,
            extra: {
                channel: { name }
            },
            executorId,
            targetId
        } = auditLog;

        const executor = await client.users.fetch(executorId);
        const target = await client.users.fetch(targetId);

        if (action === AuditLogEvent.MessageDelete) {
            console.log(
                `A message by ${target.username} was deleted by ${executor.username} in ${name}.`
            );
            return;
        }

        if (action === AuditLogEvent.MemberKick) {
            console.log(
                `${target.username} was kicked by ${executor.username}.`
            );
            return;
        }
    }
};
