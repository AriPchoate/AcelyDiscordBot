
async function assignRoles(member, level) {
  try {
    // Define role mapping: LEVEL -> ROLE NAME
    const levelRoles = {
    1: '1411541588206813275',
    2: '1411541634423718020',
    3: '1411541652761350144',
    4: '1411541716313571448',
    5: '1411541734575439952',
    6: '1411541828972580906',
    7: '1411541844797427722',
    8: '1411541861964709928',
    9: '1411541877957853264',
    10: '1411541894395199508',
    11: '1411541918294343732',
    12: '1411541936002699284',
    13: '1411541952251428894',
    14: '1411541968147714159',
    15: '1411541983171969034',
    16: '1411541999311392789',
    };

    // const levelRoles = { // Testing
    //   1: '1412841266164662454',
    //   2: '1412841287027261501',
    // }

    const roleId = levelRoles[level];
    if (!roleId) {
      console.log(`⚠️ No role mapped for level ${level}`);
      return;
    }

    const role = member.guild.roles.cache.get(roleId);
    if (!role) {
      console.log(`⚠️ Role with ID "${roleId}" not found in guild.`);
      return;
    }




    // const botMember = member.guild.members.me;

    // // Log hierarchy info
    // console.log(`Bot top role: ${botMember.roles.highest.name} (position ${botMember.roles.highest.position})`);
    // console.log(`Target member top role: ${member.roles.highest.name} (position ${member.roles.highest.position})`);
    // console.log(`Role to assign: ${role.name} (position ${role.position})`);


    // const botMember = member.guild.members.me; // bot as GuildMember
    // const roleToCheck = member.guild.roles.cache.get('1411541652761350144');

    // console.log('Bot top role:', botMember.roles.highest.name, botMember.roles.highest.position);
    // console.log('Role to assign:', roleToCheck.name, roleToCheck.position);

    // // Check permissions
    // const canManageRoles = botMember.permissions.has('ManageRoles');
    // const hierarchyOk = roleToCheck.position < botMember.roles.highest.position;

    // console.log('Bot has Manage Roles:', canManageRoles);
    // console.log('Bot can manage this role (hierarchy):', hierarchyOk);

    // if (canManageRoles && hierarchyOk) {
    //   console.log('✅ Bot can assign this role');
    // } else {
    //   console.log('❌ Bot cannot assign this role');
    // }


    const botMember = member.guild.members.me;

console.log("Bot highest:", botMember.roles.highest.name, botMember.roles.highest.position);
console.log("Target highest:", member.roles.highest.name, member.roles.highest.position);

if (member.roles.highest.position >= botMember.roles.highest.position) {
    console.log("❌ Bot CANNOT modify this member.");
} else {
    console.log("✅ Bot CAN modify this member.");
}




    // // Remove old level roles if needed
    // const rolesToRemove = member.roles.cache.filter(r => 
    //   Object.values(levelRoles).includes(r.id)
    // );
    // if (rolesToRemove.size > 0) {
    //   await member.roles.remove(rolesToRemove);
    // }

    // Add new role
    await member.roles.add(role);
    // await member.roles.add(1195099666837151764);
    console.log(`✅ Assigned ${role.name} to ${member.user.tag}`);
  } catch (err) {
    console.error("❌ Error assigning role:", err);
  }
}

module.exports = { assignRoles };
