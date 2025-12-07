const { PermissionsBitField } = require('discord.js');

/**
 * Logs the bot's role permissions in all guilds.
 * @param {import('discord.js').Client} client - The Discord client.
 */
function logBotRolePermissions(client) {
  client.on('ready', async () => {
    console.log(`\n=== [Bot Role Permissions Check] ===`);

    // Replace with your main guild ID
    const MAIN_GUILD_ID = '1070086796068786228';

    const guild = client.guilds.cache.get(MAIN_GUILD_ID);
    if (!guild) {
      console.log(`❌ Bot is not in the guild with ID ${MAIN_GUILD_ID}.`);
      return;
    }

    console.log(`\n--- Guild: ${guild.name} (ID: ${guild.id}) ---`);

    // Fetch all roles to ensure the cache is up-to-date
    await guild.roles.fetch();
    console.log('[Debug] Fetched all roles.');

    const botMember = guild.members.me;
    const hasManageRoles = botMember.permissions.has(PermissionsBitField.Flags.ManageRoles);
    console.log(`[Permissions] Bot has "Manage Roles": ${hasManageRoles}`);

    const botHighestRole = botMember.roles.highest;
    console.log(`[Hierarchy] Bot's highest role: ${botHighestRole.name} (Position: ${botHighestRole.position})`);

    // Log all roles in the guild for debugging
    console.log('[Debug] Roles in this guild:');
    guild.roles.cache.forEach((role) => {
      console.log(`- ${role.name} (ID: ${role.id}, Position: ${role.position})`);
    });

    // Example: Check a specific role
    const exampleRoleId = '1411541634423718020'; // Replace with your role ID
    const exampleRole = guild.roles.cache.get(exampleRoleId);
    if (exampleRole) {
      console.log(`[Example Role] ${exampleRole.name} (Position: ${exampleRole.position})`);
      console.log(`[Example Role] Bot can manage this role: ${botHighestRole.position > exampleRole.position}`);
    } else {
      console.log(`[Example Role] Role with ID "${exampleRoleId}" not found in this guild.`);
    }

    const everyoneRole = guild.roles.cache.get(guild.id);
    console.log(`[Hierarchy] Bot's role is above @everyone: ${botHighestRole.position > everyoneRole.position}`);
  });
}

module.exports = { logBotRolePermissions };
