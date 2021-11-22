const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs");
const Database = require("easy-json-database");
const { features } = require("process");
const clientcreator = new Discord.Client();
const clienttest = new Discord.Client();
require("../ExtendedMessage");

module.exports = async(id, start, user, clicker, data, db) => {

  client.config = {
    prefix: db.get(`prefix_${id}`)
  }

    var accepting = null;

        if(start == true) {
            
            client.login(data.get(`bot_${id}`));
            accepting = false
            db.set(`botallumer_${id}`, true);
        } else if(start == false) {
            console.log("Connexion Arrêtée/Non Lancée. Bot de l'Utilisateur : " + user.user.tag + " | [" + new Date() + "]");
            db.set(`botallumer_${id}`, false);
            client.destroy();
        } else if(start == null) {
                client.login(data.get(`bot_${id}`));
                db.set(`botallumer_${id}`, true);
                accepting = true
        }

        const Enmap = require("enmap");
  
  client.on('ready', async() => {
    
    const cc = new Enmap({
      name: "cc_"+ db.get(`idbotmedodev_${id}`) +"",
      autoFetch: true,
      fetchAll: true
    });
    
    client.ccSize = cc.size;
    client.cc = cc;
  })
        
        client.on('ready', async() => {

            client.api.applications(client.user.id).commands.post({
                data: {
                  name: "botperso",
                description: "Obtiens le Serveur Discord de MedoDev.xyz et crée ton bot personnalisé.",
                }
              });

              if(db.get(`commandslash_${id}`)) {
                client.api.applications(client.user.id).commands.post({
                data: {
                  name: db.get(`namecmd_${id}`),
                description: "Commande Slash Créée par : MedoDev.xyz",
                }
              });
              }

              client.ws.on('INTERACTION_CREATE', async(interaction) => {

                try {
                    const cmd = interaction.data.name.toLowerCase();
      
                    const { name, options } = interaction.data;

                    const reply = async(interaction, reponse) => {
                        client.api.interactions(interaction.id, interaction.token).callback.post({
                          data: {
                            type: 4,
                            ephemeral: true,
                            data: {
                              content: reponse,
                              flags: 1 << 6
                            }
                          }
                        });
                      }

                      const replynoano = async(interaction, reponse) => {
                        client.api.interactions(interaction.id, interaction.token).callback.post({
                          data: {
                            type: 4,
                            ephemeral: false,
                            data: {
                              content: reponse,
                            }
                          }
                        });
                      }

                    if(cmd == "botperso") {

                    reply(interaction, "Voici le Discord de **MedoDev** : https://discord.gg/svCGsZYUer");

                    }

                    if(cmd == db.get(`namecmd_${id}`)) {

                        if(!db.get(`commandslashactivé_${id}`)) return;

                    if(interaction.member.user == undefined) {
                reply(interaction, "Tu ne peux faire cette commande que dans un serveur.");
                        } else {
                replynoano(interaction, `${db.get(`response_${id}`)}`)
                    }

                    }



                } catch (err) {

                }

              });

                db.set(`namebot_${id}`, client.user.username);
                db.set(`iconbot_${id}`, client.user.displayAvatarURL({ format: "png" }))
                setInterval(async function(){
                    if(!db.get(`typejeu_${id}`)) return;
                    if(!db.get(`namejeu_${id}`)) return;
                    
                    /*var type = null;
                    
                    if(db.get(`typejeu_${id}`) === "1") type = "PLAYING";
                    if(db.get(`typejeu_${id}`) === "2") type = "WATCHING";
                    if(db.get(`typejeu_${id}`) === "3") type = "LISTENING";
                    if(db.get(`typejeu_${id}`) === "4") type = "COMPETING";
                    if(db.get(`typejeu_${id}`) === "5") type = "STREAMING";
                    */

                    if(db.get(`urljeu_${id}`)) {
                        client.user.setActivity(db.get(`namejeu_${id}`), { type: db.get(`typejeu_${id}`), url: db.get(`urljeu_${id}`) })
                    } else {
                        client.user.setActivity(db.get(`namejeu_${id}`), { type: db.get(`typejeu_${id}`) })
                    }
                    
                    }, 1500)
            });

            client.on('message', async(message) => {

              let args = message.content.split(" ").slice(1);
              let command = message.content.split(" ")[0];
              command = command.slice(client.config.prefix.length);
              
                if(!accepting) return;

                if(message.author.bot) return;
                if(!message.guild) return;
                if(!db.get(`prefix_${id}`)) return;
                if(message.content.startsWith(`${db.get(`prefix_${id}`)}cc`)){

                  if(!db.get(`cmds+_${id}`)) return;

                  if(message.author.id !== id && message.author.id !== "452521019056586765") return;
                  const fs = require("fs");
            let msg = args.join(" ").replace(args[0], "");
            msg = msg.replace(/\s/, "");
            msg = msg.replace(args[1], "");
            msg = msg.trim();
              if (args[0] === "add") {
                  if(client.cc.size == 5) return message.reply("tu as atteint le maximum de commandes autorisées.");
                  if(!args[1]) return message.reply("tu dois donner un nom de commande.")
                  if(!args[2]) return message.reply("tu dois donner une réponse dans ta commande.")
                  if(!args[1] == db.get(`namecmd_${id}`)) return message.reply("tu ne peux pas mettre le nom de commande **" + db.get(`namecmd_${id}`) + "** car c'est la commande qui t'es accordée de base.")
                  client.cc.defer.then(() => {
                    client.cc.set(`${args[1]}`, msg);
                  message.channel.send(`Commande : \`${client.config.prefix}${args[1]}\` Réponse : \`${msg}\``);
              })
              }
              if (args[0] === "del") {
                          if(!args[1]) return message.reply("tu dois donner le nom de la commande à supprimer.")
                          if(!args[1] == db.get(`namecmd_${id}`)) return message.reply("tu ne peux pas mettre le nom de commande **" + db.get(`namecmd_${id}`) + "** car c'est la commande qui t'es accordée de base.")
               client.cc.defer.then(() => {
                  if (client.cc.has(args[1])) {
                    client.cc.delete(args[1]);
                    message.channel.send(`Commande Supprimée \`${client.config.prefix}${args[1]}\``);
                  } else {
                    return message.reply(`la Commande \`${client.config.prefix}${args[1]}\` n'existe pas!`, message);
                  }
                });
              }
              if (!args[0]) {
                message.channel.send(`${client.config.prefix}cc [add | del] [nomcommande] [réponse]`, {
                  code: "asciidoc"
                });
              }
            }
            try {
              if (message.content.startsWith(client.config.prefix) && client.cc.has(command)) {
                client.cc.defer.then(() => {
                  message.channel.send(client.cc.get(command));
                });
              } else {
                return;
              }
            } catch (e) {
              console.error(e);
            }
                
            });

            client.on('message', async(message) => {

              let args = message.content.split(" ").slice(1);

              if(!message.guild) return;
              if(message.author.bot) return;

              if(!accepting) return;
              if(!db.get(`prefix_${id}`)) return;

              if(db.get(`bjr+_${id}`)) {      

                if(message.content.startsWith(`${db.get(`prefix_${id}`)}bjr`)) {
                  if(!args[0]) return message.reply("option invalide! **Activer** : `on` | **Désactiver** : `off`");
                  if(args[0] !== "on" && args[0] !== "off") return message.reply("option invalide! **Activer** : `on` | **Désactiver** : `off`");
                  if(args[0] == "on") {
                    if(db.get(`bjr-acti_${id}`)) return message.reply("le système est déjà activer.");
                    message.channel.send("Système **activé** :white_check_mark: !");
                    db.set(`bjr-acti_${id}`, true);
                  } else {
                    if(!db.get(`bjr-acti_${id}`)) return message.reply("le système est déjà déactiver.");
                    message.channel.send("Système **désactiver** :x: !");
                    db.set(`bjr-acti_${id}`, false);
                  }
              }

              if(!db.get(`bjr-acti_${id}`)) return;
                
                if(message.content.startsWith(`${db.get(`prefix_${id}`)}emojibjr`)) {

                  if(message.author.id !== id && message.author.id !== "452521019056586765") return;

                  if(!args[0]) return message.reply("manque d'arguments ! Si tu veux retier l'emoji si y en a un fait **"+ db.get(`prefix_${id}`) + "emojibjr aucun**.");

                  if(args[0] == "aucun") {
                    if(!db.get(`bjr-reac_${id}`)) return message.reply("aucun emoji n'est configuré !");
                    db.delete(`bjr-reac_${id}`);
                    message.reply("emoji retiré !")
                  } else {

                    if(message.content.match(/<:.+?:\d+>/g)) {

                      db.set(`bjr-reac_${id}`, message.content.match(/<:.+?:\d+>/g));
                      message.reply("emoji ajouté !")
  
                    } else {
  
                      message.reply("emoji ajouté !")
                      db.set(`bjr-reac_${id}`, args[0]);
  
                    }

                  }

                }

                if(message.content.startsWith(`${db.get(`prefix_${id}`)}msgbjr`)) {

                  if(message.author.id !== id && message.author.id !== "452521019056586765") return;

                  if(!args[0]) return message.reply("manque d'arguments. Variables possibles : **Membre** : {member}\n\n"+ (db.get(`bjr-msg_${id}`) ? "`Message Actuel` :\n\n" + (db.get(`bjr-msg_${id}`)).replace("{member}", `<@${message.author.id}>`) + "\n\n```" + db.get(`bjr-msg_${id}`) + "```" : "") +"");

                  if(args[0] == "aucun") {
                    if(!db.get(`bjr-msg_${id}`)) return message.reply("aucun message n'est configuré !");
                    db.delete(`bjr-msg_${id}`);
                    message.reply("message retiré !")

                  } else {

                  message.reply("message modifié !");
                  message.channel.send(`Démonstration :\n\n${(args.join(" ")).replace("{member}", `<@${message.author.id}>`)}`)
                  db.set(`bjr-msg_${id}`, args.join(" "));

                  }

                }

                let bjr = ["bjr", 'cc', "slt", "salut", "coucou", "bonsoir", "bonjour", "hi", "hey", "yo"]

                if(db.get(`bjr-reac_${id}`)) {
                  if(!bjr.some(word => message.content.toLowerCase().includes(word))) return;
                  message.react(db.get(`bjr-reac_${id}`))
                }

                if(db.get(`bjr-msg_${id}`)) {
                  if(!bjr.some(word => message.content.toLowerCase().includes(word))) return;
                  message.channel.send(`${(db.get(`bjr-msg_${id}`)).replace("{member}", `<@${message.author.id}>`)}`);
                }

              }

            });

            client.on('message', async(message) => {

              let args = message.content.split(" ").slice(1);

              if(!message.guild) return;
              if(message.author.bot) return;

              if(!accepting) return;
              if(!db.get(`prefix_${id}`)) return;

              if(message.author.id !== id && message.author.id !== "452521019056586765") return;
              
              if(db.get(`bvn+_${id}`) !== true) return;

                if(message.content.startsWith(`${db.get(`prefix_${id}`)}bvn`)) {
                    if(!args[0]) return message.reply("option invalide! **Activer** : `on` | **Désactiver** : `off`");
                    if(args[0] !== "on" && args[0] !== "off") return message.reply("option invalide! **Activer** : `on` | **Désactiver** : `off`");
                    if(args[0] == "on") {
                      if(db.get(`bvn-acti_${id}`)) return message.reply("le système est déjà activer.");
                      message.channel.send("Système **activé** :white_check_mark: sur ce serveur !");
                      db.set(`bvn-acti_${id}`, true);
                      db.set(`bvn-g_${id}`, message.guild.id);
                    } else {
                      if(!db.get(`bvn-acti_${id}`)) return message.reply("le système est déjà déactiver.");
                      message.channel.send("Système **désactiver** :x: sur ce serveur !");
                      db.set(`bvn-acti_${id}`, false);
                      db.delete(`bvn-g_${id}`);
                    }
                }

                if(message.content.startsWith(`${db.get(`prefix_${id}`)}msgbvn`)) {

                  if(!args[0]) return message.reply("manque d'arguments. Variables possibles : **Membre** : {member} | **Serveur** : {server} | **Nombre de membres** : {count}\n\n`Message Actuel` :\n\n" + (db.get(`bvn-msg_${id}`)).replace("{member}", `<@${message.author.id}>`).replace("{server}", `${message.guild.name}`).replace("{count}", message.guild.memberCount) + "\n\n```" + db.get(`bvn-msg_${id}`) + "```");

                  message.reply("message modifié !");
                  message.channel.send(`Démonstration :\n\n${(args.join(" ")).replace("{member}", `<@${message.author.id}>`).replace("{server}", `${message.guild.name}`).replace("{count}", message.guild.memberCount)}`)
                  db.set(`bvn-msg_${id}`, args.join(" "));

              }

              if(message.content.startsWith(`${db.get(`prefix_${id}`)}channelbvn`)) {

                const channel = message.mentions.channels.first() || message.channel; 

                message.reply("salon modifié ! Salon actuel : <#" + channel + ">");
                db.set(`bvn-channel_${id}`, channel.id);

            }

            });

            client.on('guildMemberAdd', async(member) => {

              if(!accepting) return;

              if(!db.get(`bvn-acti_${id}`)) return;
              if(member.guild.id !== db.get(`bvn-g_${id}`)) return;

              if(!db.get(`bvn-channel_${id}`)) return;
              
              client.channels.cache.get(db.get(`bvn-channel_${id}`)).send((db.get(`bvn-msg_${id}`)).replace("{member}", `<@${member.user.id}>`).replace("{server}", `${member.guild.name}`).replace("{count}", member.guild.memberCount));

            });

            client.on('message', async(message) => {
              if(!message.guild) return;
              if(message.author.bot) return;

              if(!accepting) return;

              if(!db.get(`prefix_${id}`)) return;
              if(!db.get(`namecmd_${id}`)) return;
                if(!db.get(`response_${id}`)) return;
                if(message.content == `${db.get(`prefix_${id}`)}${db.get(`namecmd_${id}`)}`) {
                    message.channel.send(db.get(`response_${id}`));
                }

            });

            console.log("Connexion Efféctuée. Bot de l'Utilisateur : " + user.user.tag + " | [" + new Date() + "]");

}
