/**

 * System commands
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * These are system commands - commands required for Pokemon Showdown
 * to run. A lot of these are sent by the client.
 *
 * If you'd like to modify commands, please go to config/commands.js,
 * which also teaches you how to use commands.
 *
 * @license MIT license
 */
var bank = exports.bank = {
	bucks: function(uid, amount, take) {
		var data = fs.readFileSync('config/money.csv','utf8')
		var match = false;
		var money = 0;
		var row = (''+data).split("\n");
		var line = '';
		for (var i = row.length; i > -1; i--) {
			if (!row[i]) continue;
			var parts = row[i].split(",");
			var userid = toUserid(parts[0]);
			if (uid.userid == userid) {
				var x = Number(parts[1]);
				var money = x;
				match = true;
				if (match === true) {
					line = line + row[i];
					break;
				}
			}
		}
		uid.money = money;
		if (take === true){if (amount <= uid.money){
		uid.money = uid.money - amount; take = false;}
		else return false;
		}
		else {uid.money = uid.money + amount;}
		if (match === true) {
			var re = new RegExp(line,"g");
			fs.readFile('config/money.csv', 'utf8', function (err,data) {
			if (err) {
				return console.log(err);
			}
			var result = data.replace(re, uid.userid+','+uid.money);
			fs.writeFile('config/money.csv', result, 'utf8', function (err) {
				if (err) return console.log(err);
			});
			});
		} else {
			var log = fs.createWriteStream('config/money.csv', {'flags': 'a'});
			log.write("\n"+uid.userid+','+uid.money);
		}
		return true;
		},
				
	coins: function(uid, amount, take) {

	    var lore = fs.readFileSync('config/coins.csv','utf8')
                var match = false;
                var coins = 0;
                var spag = (''+lore).split("\n");
                var hetti = '';
                for (var i = spag.length; i > -1; i--) {
                    if (!spag[i]) continue;
                    var parts = spag[i].split(",");
                    var userid = toUserid(parts[0]);
					if (uid.userid == userid) {
                        var x = Number(parts[1]);
                        var coins = x;
                        match = true;
                        if (match === true) {
                            hetti = hetti + spag[i];
                            break;
                        }
                    }
                }
                uid.coins = coins;
						if (take === true){if (amount <= uid.coins){
				uid.coins = uid.coins - amount; take = false;}
				else return false;
				}
				else {uid.coins = uid.coins + amount;}
				
                if (match === true) {
                    var be = new RegExp(hetti,"g");
                    fs.readFile('config/coins.csv', 'utf8', function (err,lore) {
                        if (err) {
                            return console.log(err);
                        }
                        var result = lore.replace(be, uid.userid+','+uid.coins);
                        fs.writeFile('config/coins.csv', result, 'utf8', function (err) {
                            if (err) return console.log(err);
                        });
                    });
                } else {
                    var log = fs.createWriteStream('config/coins.csv', {'flags': 'a'});
                    log.write("\n"+uid.userid+','+uid.coins);
                } return true;
		}


	}
var crypto = require('crypto');
var poofeh = true;
var ipbans = fs.createWriteStream('config/ipbans.txt', {'flags': 'a'});
var logeval = fs.createWriteStream('logs/eval.txt', {'flags': 'a'});
var inShop = ['symbol', 'custom', 'animated', 'room', 'trainer', 'fix', 'declare'];
var closeShop = false;
var closedShop = 0;
var avatar = fs.createWriteStream('config/avatars.csv', {'flags': 'a'}); // for /customavatar
//spamroom
if (typeof spamroom == "undefined") {
        spamroom = new Object();
}
if (!Rooms.rooms.spamroom) {
        Rooms.rooms.spamroom = new Rooms.ChatRoom("spamroom", "spamroom");
        Rooms.rooms.spamroom.isPrivate = true;
}
if (typeof tells === 'undefined') {
	tells = {};
}

const MAX_REASON_LENGTH = 300;

var commands = exports.commands = {



	createpoints: function(target, room, user, connection) {
		if(!user.can('hotpatch')) return this.sendReply('You do not have enough authority to do this.');
		fs.exists('config/money.csv', function (exists) {
			if(exists){
				return connection.sendTo(room, 'Since this file already exists, you cannot do this.');
			} else {
				fs.writeFile('config/money.csv', 'blakjack,1e+999', function (err) {
					if (err) throw err;
					console.log('config/money.csv created.');
					connection.sendTo(room, 'config/money.csv created.');
				});
			}
		});
	},


	createcoins: function(target, room, user, connection) {
		if (!user.can('hotpatch')) return this.sendReply('You do not have enough authority to do this.');
		fs.exists('config/coins.csv', function (exists) {
			if (exists) {
				return connection.sendTo(room, 'This file already exists so you do not need to create it again.')
			} else {
				fs.writeFile('config/coins.csv', 'blakjack,1e+999', function (err) {
					if (err) throw err;
					console.log('config/coins.csv created.');
					connection.sendTo(room, 'config/coins.csv created,');
				});
			}
		});
	},

	

	/*********************************************************
	 * Money                                     
	 *********************************************************/

	bp: 'atm',
	wallet: 'atm',
	satchel: 'atm',
	fannypack: 'atm',
	purse: 'atm',
	bag: 'atm',
	atm: function(target, room, user, connection, cmd) {
	if (!this.canBroadcast()) return;
	var cMatch = false;
	var mMatch = false;
	var money = 0;
	var coins = 0;
	var total = '';
	if (!target) {
	var data = fs.readFileSync('config/money.csv','utf8')
		var row = (''+data).split("\n");
		for (var i = row.length; i > -1; i--) {
			if (!row[i]) continue;
			var parts = row[i].split(",");
			var userid = toUserid(parts[0]);
			if (user.userid == userid) {
			var x = Number(parts[1]);
			var money = x;
			mMatch = true;
			if (mMatch === true) {
				break;
			}
			}
		}
		if (mMatch === true) {
			var p = 'bucks';
			if (money < 2) p = 'buck';
			total += user.name + ' has ' + money + ' ' + p + '.<br />';
		}
		if (mMatch === false) {
			total += 'You have no bucks.<br />';
		}
		user.money = money;
		var data = fs.readFileSync('config/coins.csv','utf8')
		var row = (''+data).split("\n");
		for (var i = row.length; i > -1; i--) {
			if (!row[i]) continue;
			var parts = row[i].split(",");
			var userid = toUserid(parts[0]);
			if (user.userid == userid) {
			var x = Number(parts[1]);
			var coins = x;
			cMatch = true;
			if (cMatch === true) {
				break;
			}
			}
		}
		if (cMatch === true) {
			var p = 'coins';
			if (coins < 2) p = 'coin';
			total += user.name + ' has ' + coins + ' ' + p + '.'
		}
		if (cMatch === false) {
			total += 'You have no coins.'
		}
		user.coins = coins;
	} else {
		var data = fs.readFileSync('config/money.csv','utf8')
		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser) {
			return this.sendReply('User '+this.targetUsername+' not found.');
		}
		var money = 0;
		var row = (''+data).split("\n");
		for (var i = row.length; i > -1; i--) {
			if (!row[i]) continue;
			var parts = row[i].split(",");
			var userid = toUserid(parts[0]);
			if (targetUser.userid == userid || target == userid) {
			var x = Number(parts[1]);
			var money = x;
			mMatch = true;
			if (mMatch === true) {
				break;
			}
			}
		}
		if (mMatch === true) {
			var p = 'bucks';
			if (money < 2) p = 'buck';
			total += targetUser.name + ' has ' + money + ' ' + p + '.<br />';
		} 
		if (mMatch === false) {
			total += targetUser.name + ' has no bucks.<br />';
		}
		targetUser.money = money;
		var data = fs.readFileSync('config/coins.csv','utf8')
		var coins = 0;
		var row = (''+data).split("\n");
		for (var i = row.length; i > -1; i--) {
			if (!row[i]) continue;
			var parts = row[i].split(",");
			var userid = toUserid(parts[0]);
			if (targetUser.userid == userid || target == userid) {
			var x = Number(parts[1]);
			var coins = x;
			cMatch = true;
			if (cMatch === true) {
				break;
			}
			}
		}
		if (cMatch === true) {
			var p = 'coins';
			if (coins < 2) p = 'coin';
			total += targetUser.name + ' has ' + coins + ' ' + p + '.<br />';
		} 
		if (cMatch === false) {
			total += targetUser.name + ' has no coins.<br />';
		}
		targetUser.coins = coins;
	}
	return this.sendReplyBox(total);
	},

	awardbucks: 'givebucks',
	gb: 'givebucks',
	givebucks: function(target, room, user) {
		if(!user.can('hotpatch')) return this.sendReply('You do not have enough authority to do this.');
		if(!target) return this.parse('/help givebucks');
		if (target.indexOf(',') != -1) {
			var parts = target.split(',');
			parts[0] = this.splitTarget(parts[0]);
			var targetUser = this.targetUser;
		if (!targetUser) {
			return this.sendReply('User '+this.targetUsername+' not found.');
		}
		if (isNaN(parts[1])) {
			return this.sendReply('Very funny, now use a real number.');
		}
		var cleanedUp = parts[1].trim();
		var giveMoney = Number(cleanedUp);
		var data = fs.readFileSync('config/money.csv','utf8')
		var match = false;
		var money = 0;
		var line = '';
		var row = (''+data).split("\n");
		for (var i = row.length; i > -1; i--) {
			if (!row[i]) continue;
			var parts = row[i].split(",");
			var userid = toUserid(parts[0]);
			if (targetUser.userid == userid) {
			var x = Number(parts[1]);
			var money = x;
			match = true;
			if (match === true) {
				line = line + row[i];
				break;
			}
			}
		}
		targetUser.money = money;
		targetUser.money += giveMoney;
		if (match === true) {
			var re = new RegExp(line,"g");
			fs.readFile('config/money.csv', 'utf8', function (err,data) {
			if (err) {
				return console.log(err);
			}
			var result = data.replace(re, targetUser.userid+','+targetUser.money);
			fs.writeFile('config/money.csv', result, 'utf8', function (err) {
				if (err) return console.log(err);
			});
			});
		} else {
			var log = fs.createWriteStream('config/money.csv', {'flags': 'a'});
			log.write("\n"+targetUser.userid+','+targetUser.money);
		}
		var p = 'bucks';
		if (giveMoney < 2) p = 'buck';
		this.sendReply(targetUser.name + ' was given ' + giveMoney + ' ' + p + '. This user now has ' + targetUser.money + ' bucks.');
		targetUser.send(user.name + ' has given you ' + giveMoney + ' ' + p + '.');
		} else {
			return this.parse('/help givebucks');
		}
	},

	takebucks: 'removebucks',
	removebucks: function(target, room, user) {
		if(!user.can('hotpatch')) return this.sendReply('You do not have enough authority to do this.');
		if(!target) return this.parse('/help removebucks');
		if (target.indexOf(',') != -1) {
			var parts = target.split(',');
			parts[0] = this.splitTarget(parts[0]);
			var targetUser = this.targetUser;
		if (!targetUser) {
			return this.sendReply('User '+this.targetUsername+' not found.');
		}
		if (isNaN(parts[1])) {
			return this.sendReply('Very funny, now use a real number.');
		}
		var cleanedUp = parts[1].trim();
		var takeMoney = Number(cleanedUp);
		var data = fs.readFileSync('config/money.csv','utf8')
		var match = false;
		var money = 0;
		var line = '';
		var row = (''+data).split("\n");
		for (var i = row.length; i > -1; i--) {
			if (!row[i]) continue;
			var parts = row[i].split(",");
			var userid = toUserid(parts[0]);
			if (targetUser.userid == userid) {
			var x = Number(parts[1]);
			var money = x;
			match = true;
			if (match === true) {
				line = line + row[i];
				break;
			}
			}
		}
		targetUser.money = money;
		targetUser.money -= takeMoney;
		if (match === true) {
			var re = new RegExp(line,"g");
			fs.readFile('config/money.csv', 'utf8', function (err,data) {
			if (err) {
				return console.log(err);
			}
			var result = data.replace(re, targetUser.userid+','+targetUser.money);
			fs.writeFile('config/money.csv', result, 'utf8', function (err) {
				if (err) return console.log(err);
			});
			});
		} else {
			var log = fs.createWriteStream('config/money.csv', {'flags': 'a'});
			log.write("\n"+targetUser.userid+','+targetUser.money);
		}
		var p = 'bucks';
		if (takeMoney < 2) p = 'buck';
		this.sendReply(targetUser.name + ' has had ' + takeMoney + ' ' + p + ' removed. This user now has ' + targetUser.money + ' bucks.');
		targetUser.send(user.name + ' has removed ' + takeMoney + ' bucks from you.');
		} else {
			return this.parse('/help removebucks');
		}
	},

	buy: function(target, room, user) {
		if (!target) return this.parse('/help buy');
		if (closeShop) return this.sendReply('The shop is currently closed and will open shortly.');
		var data = fs.readFileSync('config/money.csv','utf8')
		var match = false;
		var money = 0;
		var line = '';
		var row = (''+data).split("\n");
		for (var i = row.length; i > -1; i--) {
			if (!row[i]) continue;
			var parts = row[i].split(",");
			var userid = toUserid(parts[0]);
			if (user.userid == userid) {
			var x = Number(parts[1]);
			var money = x;
			match = true;
			if (match === true) {
				line = line + row[i];
				break;
			}
			}
		}
		user.money = money;
		var price = 0;
		if (target === 'symbol') {
			price = 5;
			if (price <= user.money) {
				user.money = user.money - price;
				this.sendReply('You have purchased a custom symbol. You will have this until you log off for more than an hour.');
				this.sendReply('Use /customsymbol [symbol] to change your symbol now!');
				user.canCustomSymbol = true;
				this.add(user.name + ' has purchased a custom symbol!');
			} else {
				return this.sendReply('You do not have enough bucks for this. You need ' + (price - user.money) + ' more bucks to buy ' + target + '.');
			}
		}
		if (target === 'custom') {
			price = 20;
			if (price <= user.money) {
				user.money = user.money - price;
				this.sendReply('You have purchased a custom avatar. You need to message an Admin Ask Ruby or Liz..');
				user.canCustomAvatar = true;
				this.add(user.name + ' has purchased a custom avatar!');
			} else {
				return this.sendReply('You do not have enough bucks for this. You need ' + (price - user.money) + ' more bucks to buy ' + target + '.');
			}
		}
		if (target === 'animated') {
			price = 35;
			if (price <= user.money) {
				user.money = user.money - price;
				this.sendReply('You have purchased a custom animated avatar. You need to message an Admin capable of adding Ruby or Liz.');
				user.canAnimatedAvatar = true;
				this.add(user.name + ' has purchased a custom animated avatar!');
			} else {
				return this.sendReply('You do not have enough bucks for this. You need ' + (price - user.money) + ' more bucks to buy ' + target + '.');
			}
		}
		if (target === 'room') {
			price = 100;
			if (price <= user.money) {
				user.money = user.money - price;
				this.sendReply('You have purchased a chat room. You need to message an Admin so that the room can be made.');
				user.canChatRoom = true;
				this.add(user.name + ' has purchased a chat room!');
			} else {
				return this.sendReply('You do not have enough bucks for this. You need ' + (price - user.money) + ' more bucks to buy ' + target + '.');
			}
		}
		if (target === 'trainer') {
			price = 30;
			if (price <= user.money) {
				user.money = user.money - price;
				this.sendReply('You have purchased a trainer card. You need to message an Admin capable of adding this Ruby or Liz.');
				user.canTrainerCard = true;
				this.add(user.name + ' has purchased a trainer card!');
			} else {
				return this.sendReply('You do not have enough bucks for this. You need ' + (price - user.money) + ' more bucks to buy ' + target + '.');
			}
		}
		if (target === 'fix') {
			price = 10;
			if (price <= user.money) {
				user.money = user.money - price;
				this.sendReply('You have purchased the ability to alter your avatar or trainer card. You need to message an Admin capable of adding this Ruby or Liz.');
				user.canFixItem = true;
				this.add(user.name + ' has purchased the ability to set alter their card or avatar!');
			} else {
				return this.sendReply('You do not have enough bucks for this. You need ' + (price - user.money) + ' more bucks to buy ' + target + '.');
			}
		}
		if (target === 'declare') {
			price = 25;
			if (price <= user.money) {
				user.money = user.money - price;
				this.sendReply('You have purchased the ability to declare (from Admin). To do this message an Admin (~) with the message you want to send. Keep it sensible!');
				user.canDecAdvertise = true;
				this.add(user.name + ' has purchased the ability to declare from an Admin!');
			} else {
				return this.sendReply('You do not have enough bucks for this. You need ' + (price - user.money) + ' more bucks to buy ' + target + '.');
			}
		}
				if (match === true) {
			var re = new RegExp(line,"g");
			fs.readFile('config/money.csv', 'utf8', function (err,data) {
			if (err) {
				return console.log(err);
			}
			var result = data.replace(re, user.userid+','+user.money);
			fs.writeFile('config/money.csv', result, 'utf8', function (err) {
				if (err) return console.log(err);
			});
			});
		} else {
					var log = fs.createWriteStream('config/money.csv', {'flags': 'a'});
					log.write("\n"+user.userid+','+user.money);
				}
		
			var bunnywheel = 0;
		var stringbit = 0;
		if (target === 'coin') { 
		// change costV
		bunnywheel = 100;
		// change cost^
		take = true;
		hipe = user;
		amount = bunnywheel;
		checkatm = bank.bucks(hipe, amount, take);
		    if (checkatm == true) {

                  hipe = user;
                             //change payoutV
				  amount = 1;
		            // change payout^
				  take = false;
				  bank.coins(hipe, amount);
				this.sendReply('You put together ' +bunnywheel +' bucks and put it in change machine!');
				this.add('!!!' + user.name + ' has activated the change machine and through hardwork and the sacrifice of many innocent bucks has made one whole coin!');
			} else {
                return this.sendReply('You do not have enough bucks to do this! You need ' + (bunnywheel - user.money) + ' more bucks to make a coin!');
            } 
			}
			
			if (target == 'buck')
		{
		// change costV
		bitshredder = 1;
		//change cost^
		take = true;
		hipe = user;
		russianfunny = bitshredder;
		checkatm = bank.coins(hipe, russianfunny, take);
		    if (checkatm == true) {

                  hipe = user;    
                                   //change payoutV
				  russianfunny = 100;
				  // change payout^
				  take = false;
				  bank.bucks(hipe, russianfunny);
				this.sendReply('You put a coin into the change machine!');
				this.add('!!!' + user.name + ' has activated the change machine and dropped a coin into it! as it lets out a  faint scream and 100 bucks come out!');
			} else {
                return this.sendReply('You do not have enough coins to do this! You need ' + (bitshredder - user.coins) + ' more coins to make 100 bucks!');
            } 
			}
	
                        


				

	},

	customsymbol: function(target, room, user) {
		if(!user.canCustomSymbol) return this.sendReply('You need to buy this item from the shop to use.');
		if(!target || target.length > 1) return this.sendReply('/customsymbol [symbol] - changes your symbol (usergroup) to the specified symbol. The symbol can only be one character');
		var a = target;
		if (a === "+" || a === "$" || a === "%" || a === "@" || a === "&" || a === "~" || a === "#" || a === "a" || a === "b" || a === "c" || a === "d" || a === "e" || a === "f" || a === "g" || a === "h" || a === "i" || a === "j" || a === "k" || a === "l" || a === "m" || a === "n" || a === "o" || a === "p" || a === "q" || a === "r" || a === "s" || a === "t" || a === "u" || a === "v" || a === "w" || a === "x" || a === "y" || a === "z") {
			return this.sendReply('Sorry, but you cannot change your symbol to this for safety/stability reasons.');
		}
		user.getIdentity = function(){
			if(this.muted)	return '!' + this.name;
			if(this.locked) return '‽' + this.name;
			return target + this.name;
		};
		user.updateIdentity();
		user.canCustomSymbol = false;
	},



	
	shop: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><h4><b><u>Leaf League shop</u></b></h4><table border="1" cellspacing ="0" cellpadding="3"><tr><th>Command</th><th>Description</th><th>Cost</th></tr>' +
			'<tr><td>Symbol</td><td>Buys a custom symbol to go infront of name and puts you at top of userlist (temporary until restart)</td><td>5</td></tr>' +
			'<tr><td>Custom</td><td>Buys a custom avatar to be applied to your name (you supply)</td><td>20</td></tr>' +
			'<tr><td>Animated</td><td>Buys an animated avatar to be applied to your name (you supply)</td><td>35</td></tr>' +
			'<tr><td>Room</td><td>Buys a chatroom for you to own (within reason, can be refused)</td><td>100</td></tr>' +
			'<tr><td>Trainer</td><td>Buys a trainer card which shows information through a command such as /blakjack (note: third image costs 10 bucks extra, ask for more details)</td><td>40</td></tr>' +
			'<tr><td>Fix</td><td>Buys the ability to alter your current custom avatar or trainer card (don\'t buy if you have neither)!</td><td>10</td></tr>' +
			'<tr><td>Declare</td><td>You get the ability to get two declares from an Admin in lobby. This can be used for league advertisement (not server)</td><td>25</td></tr>' +
			'</table><center><table border="1" cellspacing ="0" cellpadding="4"><tr><th>Command</th><th>change converter!</th><th>PAYOUT</th></tr>' +
		        '<tr><td>coin</td><td>Turns <b>100 bucks</b> into <b>1 coin</b>!</td><td>1 coin</td></tr>' +
		        '<tr><td>buck</td><td>Turns <b>1 coin</b> into <b>100 bucks</b>!</td><td>100 bucks</td></tr>' +
			'</table><br />To buy an item from the shop, use /buy [command]. <br />Also do /moneycommands to view money based commands.</center>'
			);
		if (closeShop) return this.sendReply('|raw|<center><h3><b>The shop is currently closed and will open shortly.</b></h3></center>');
	},

	lockshop: 'closeshop',
	closeshop: function(target, room, user) {
		if (!user.can('hotpatch')) return this.sendReply('You do not have enough authority to do this.');

		if(closeShop && closedShop === 1) closedShop--;

		if (closeShop) {
			return this.sendReply('The shop is already closed. Use /openshop to open the shop to buyers.');
		}
		else if (!closeShop) {
			if (closedShop === 0) {
				this.sendReply('Are you sure you want to close the shop? People will not be able to buy anything. If you do, use the command again.');
				closedShop++;
			}
			else if (closedShop === 1) {
				closeShop = true;
				closedShop--;
				this.add('|raw|<center><h4><b>The shop has been temporarily closed, during this time you cannot buy items.</b></h4></center>');
			}
		}
	},

	openshop: function(target, room, user) {
		if (!user.can('hotpatch')) return this.sendReply('You do not have enough authority to do this.');

		if (!closeShop && closedShop === 1) closedShop--;

		if (!closeShop) {
			return this.sendRepy('The shop is already closed. Use /closeshop to close the shop to buyers.');
		}
		else if (closeShop) {
			if (closedShop === 0) {
				this.sendReply('Are you sure you want to open the shop? People will be able to buy again. If you do, use the command again.');
				closedShop++;
			}
			else if (closedShop === 1) {
				closeShop = false;
				closedShop--;
				this.add('|raw|<center><h4><b>The shop has been opened, you can now buy from the shop.</b></h4></center>');
			}
		}
	},

	shoplift: 'awarditem',
	giveitem: 'awarditem',
	awarditem: function(target, room, user) {
		if (!target) return this.parse('/help awarditem');
		if(!user.can('hotpatch')) return this.sendReply('You do not have enough authority to do this.');

		target = this.splitTarget(target);
		var targetUser = this.targetUser;

		if (!target) return this.parse('/help awarditem');
		if (!targetUser) {
			return this.sendReply('User '+this.targetUsername+' not found.');
		}

		var matched = false;
		var isItem = false;
		var theItem = '';
		for (var i = 0; i < inShop.length; i++) {
			if (target.toLowerCase() === inShop[i]) {
				isItem = true;
				theItem = inShop[i];
			}
		}
		if (isItem === true) {
			if (theItem === 'symbol') {
				if (targetUser.canCustomSymbol === true) {
					return this.sendReply('This user has already bought that item from the shop... no need for another.');
				}
				if (targetUser.canCustomSymbol === false) {
					matched = true;
					this.sendReply(targetUser.name + ' can now use /customsymbol to get a custom symbol.');
					targetUser.canCustomSymbol = true;
					Rooms.rooms.lobby.add(user.name + ' has stolen custom symbol from the shop!');
					targetUser.send(user.name + ' has given you ' + theItem + '! Use /customsymbol [symbol] to add the symbol!');
				}
			}
			if (theItem === 'custom') {
				if (targetUser.canCustomAvatar === true) {
					return this.sendReply('This user has already bought that item from the shop... no need for another.');
				}
				if (targetUser.canCustomAvatar === false) {
					matched = true;
					targetUser.canCustomSymbol = true;
					Rooms.rooms.lobby.add(user.name + ' has stolen a custom avatar from the shop!');
					targetUser.send(user.name + ' has given you ' + theItem + '!');
				}
			}
			if (theItem === 'animated') {
				if (targetUser.canAnimated === true) {
					return this.sendReply('This user has already bought that item from the shop... no need for another.');
				}
				if (targetUser.canCustomAvatar === false) {
					matched = true;
					targetUser.canCustomAvatar = true;
					Rooms.rooms.lobby.add(user.name + ' has stolen a custom avatar from the shop!');
					targetUser.send(user.name + ' has given you ' + theItem + '!');
				}
			}
			if (theItem === 'room') {
				if (targetUser.canChatRoom === true) {
					return this.sendReply('This user has already bought that item from the shop... no need for another.');
				}
				if (targetUser.canChatRoom === false) {
					matched = true;
					targetUser.canChatRoom = true;
					Rooms.rooms.lobby.add(user.name + ' has stolen a chat room from the shop!');
					targetUser.send(user.name + ' has given you ' + theItem + '!');
				}
			}
			if (theItem === 'trainer') {
				if (targetUser.canTrainerCard === true) {
					return this.sendReply('This user has already bought that item from the shop... no need for another.');
				}
				if (targetUser.canTrainerCard === false) {
					matched = true;
					targetUser.canTrainerCard = true;
					Rooms.rooms.lobby.add(user.name + ' has stolen a trainer card from the shop!');
					targetUser.send(user.name + ' has given you ' + theItem + '!');
				}
			}
			if (theItem === 'fix') {
				if (targetUser.canFixItem === true) {
					return this.sendReply('This user has already bought that item from the shop... no need for another.');
				}
				if (targetUser.canFixItem === false) {
					matched = true;
					targetUser.canFixItem = true;
					Rooms.rooms.lobby.add(user.name + ' has stolen the ability to alter a current trainer card or avatar from the shop!');
					targetUser.send(user.name + ' has given you the ability to set ' + theItem + '!');
				}
			}
			if (theItem === 'declare') {
				if (targetUser.canDecAdvertise === true) {
					return this.sendReply('This user has already bought that item from the shop... no need for another.');
				}
				if (targetUser.canDecAdvertise === false) {
					matched = true;
					targetUser.canDecAdvertise = true;
					Rooms.rooms.lobby.add(user.name + ' has stolen the ability to get a declare from the shop!');
					targetUser.send(user.name + ' has given you the ability to set ' + theItem + '!');
				}
			}
			else
				if (!matched) return this.sendReply('Maybe that item isn\'t in the shop yet.');
		}
		else 
			return this.sendReply('Shop item could not be found, please check /shop for all items - ' + theItem);
	},

	removeitem: function(target, room, user) {
		if (!target) return this.parse('/help removeitem');
		if(!user.can('hotpatch')) return this.sendReply('You do not have enough authority to do this.');

		target = this.splitTarget(target);
		var targetUser = this.targetUser;

		if (!target) return this.parse('/help removeitem');
		if (!targetUser) {
			return this.sendReply('User '+this.targetUsername+' not found.');
		}

		if (target === 'symbol') {
			if (targetUser.canCustomSymbol) {
				targetUser.canCustomSymbol = false;
				this.sendReply(targetUser.name + ' no longer has a custom symbol ready to use.');
				targetUser.send(user.name + ' has removed the custom symbol from you.');
			}
			else
				return this.sendReply('They do not have a custom symbol for you to remove.');
		}
		else if (target === 'custom') {
			if (targetUser.canCustomAvatar) {
				targetUser.canCustomAvatar = false;
				this.sendReply(targetUser.name + ' no longer has a custom avatar ready to use.');
				targetUser.send(user.name + ' has removed the custom avatar from you.');
			}
			else
				return this.sendReply('They do not have a custom avatar for you to remove.');
		}
		else if (target === 'animated') {
			if (targetUser.canAnimatedAvatar) {
				targetUser.canAnimatedAvatar = false;
				this.sendReply(targetUser.name + ' no longer has a animated avatar ready to use.');
				targetUser.send(user.name + ' has removed the animated avatar from you.');
			}
			else
				return this.sendReply('They do not have an animated avatar for you to remove.');
		}
		else if (target === 'room') {
			if (targetUser.canChatRoom) {
				targetUser.canChatRoom = false;
				this.sendReply(targetUser.name + ' no longer has a chat room ready to use.');
				targetUser.send(user.name + ' has removed the chat room from you.');
			}
			else
				return this.sendReply('They do not have a chat room for you to remove.');
		}
		else if (target === 'trainer') {
			if (targetUser.canTrainerCard) {
				targetUser.canTrainerCard = false;
				this.sendReply(targetUser.name + ' no longer has a trainer card ready to use.');
				targetUser.send(user.name + ' has removed the trainer card from you.');
			}
			else
				return this.sendReply('They do not have a trainer card for you to remove.');
		}
		else if (target === 'fix') {
			if (targetUser.canFixItem) {
				targetUser.canFixItem = false;
				this.sendReply(targetUser.name + ' no longer has the fix to use.');
				targetUser.send(user.name + ' has removed the fix from you.');
			}
			else
				return this.sendReply('They do not have a trainer card for you to remove.');
		}
		else if (target === 'declare') {
			if (targetUser.canDecAdvertise) {
				targetUser.canDecAdvertise = false;
				this.sendReply(targetUser.name + ' no longer has a declare ready to use.');
				targetUser.send(user.name + ' has removed the declare from you.');
			}
			else
				return this.sendReply('They do not have a trainer card for you to remove.');
		}
		else
			return this.sendReply('That isn\'t a real item you fool!');
	},

	moneycommands: function(target, room, user) {
		if (!this.canBroadcast()) return;
		return this.sendReplyBox('The command for the Money system:<br />' + 
			'/shop - Show the shop with the items you can buy.<br />' + 
			'/buy [command] - Buy an item from the shop using the item command name.<br />' +
			'/getbucks - A basic introduction into the currency system.<br />' + 
			'/atm [username] - Show your bucks (if just /atm) or show someone else\'s bucks.<br />' + 
			'/prizes - A link to the prize page and ways to earn bucks.');
	},

	/*********************************************************
	 * Coins                                     
	 *********************************************************/

	givecoins: function(target, room, user) {
		if(!user.can('hotpatch')) return this.sendReply('You do not have enough authority to do this.');
		if(!target) return this.parse('/help givecoins');
		if (target.indexOf(',') != -1) {
			var parts = target.split(',');
			parts[0] = this.splitTarget(parts[0]);
			var targetUser = this.targetUser;
		if (!targetUser) {
			return this.sendReply('User '+this.targetUsername+' not found.');
		}
		if (isNaN(parts[1])) {
			return this.sendReply('Very funny, now use a real number.');
		}
		var cleanedUp = parts[1].trim();
		var giveCoins = Number(cleanedUp);
		var data = fs.readFileSync('config/coins.csv','utf8')
		var match = false;
		var coins = 0;
		var line = '';
		var row = (''+data).split("\n");
		for (var i = row.length; i > -1; i--) {
			if (!row[i]) continue;
			var parts = row[i].split(",");
			var userid = toUserid(parts[0]);
			if (targetUser.userid == userid) {
			var x = Number(parts[1]);
			var coins = x;
			match = true;
			if (match === true) {
				line = line + row[i];
				break;
			}
			}
		}
		targetUser.coins = coins;
		targetUser.coins += giveCoins;
		if (match === true) {
			var re = new RegExp(line,"g");
			fs.readFile('config/coins.csv', 'utf8', function (err,data) {
			if (err) {
				return console.log(err);
			}
			var result = data.replace(re, targetUser.userid+','+targetUser.coins);
			fs.writeFile('config/coins.csv', result, 'utf8', function (err) {
				if (err) return console.log(err);
			});
			});
		} else {
			var log = fs.createWriteStream('config/coins.csv', {'flags': 'a'});
			log.write("\n"+targetUser.userid+','+targetUser.coins);
		}
		var p = 'coins';
		if (giveCoins < 2) p = 'coin';
		this.sendReply(targetUser.name + ' was given ' + giveCoins + ' ' + p + '. This user now has ' + targetUser.coins + ' coins.');
		targetUser.send(user.name + ' has given you ' + giveCoins + ' ' + p + '.');
		} else {
			return this.parse('/help givecoins');
		}
	},

	takecoins: function(target, room, user) {
		if(!user.can('hotpatch')) return this.sendReply('You do not have enough authority to do this.');
		if(!target) return this.parse('/help takecoins');
		if (target.indexOf(',') != -1) {
			var parts = target.split(',');
			parts[0] = this.splitTarget(parts[0]);
			var targetUser = this.targetUser;
		if (!targetUser) {
			return this.sendReply('User '+this.targetUsername+' not found.');
		}
		if (isNaN(parts[1])) {
			return this.sendReply('Very funny, now use a real number.');
		}
		var cleanedUp = parts[1].trim();
		var takeCoins = Number(cleanedUp);
		var data = fs.readFileSync('config/coins.csv','utf8')
		var match = false;
		var coins = 0;
		var line = '';
		var row = (''+data).split("\n");
		for (var i = row.length; i > -1; i--) {
			if (!row[i]) continue;
			var parts = row[i].split(",");
			var userid = toUserid(parts[0]);
			if (targetUser.userid == userid) {
			var x = Number(parts[1]);
			var coins = x;
			match = true;
			if (match === true) {
				line = line + row[i];
				break;
			}
			}
		}
		targetUser.coins = coins;
		targetUser.coins -= takeCoins;
		if (match === true) {
			var re = new RegExp(line,"g");
			fs.readFile('config/coins.csv', 'utf8', function (err,data) {
			if (err) {
				return console.log(err);
			}
			var result = data.replace(re, targetUser.userid+','+targetUser.coins);
			fs.writeFile('config/coins.csv', result, 'utf8', function (err) {
				if (err) return console.log(err);
			});
			});
		} else {
			var log = fs.createWriteStream('config/coins.csv', {'flags': 'a'});
			log.write("\n"+targetUser.userid+','+targetUser.coins);
		}
		var p = 'coins';
		if (giveCoins < 2) p = 'coin';
		this.sendReply(targetUser.name + ' was had ' + takeCoins + ' ' + p + ' removed. This user now has ' + targetUser.coins + ' coins.');
		targetUser.send(user.name + ' has given you ' + takeCoins + ' ' + p + '.');
		} else {
			return this.parse('/help takecoins');
		}
	},

	version: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('Server version: <b>'+CommandParser.package.version+'</b> <small>(<a href="http://pokemonshowdown.com/versions#' + CommandParser.serverVersion + '">' + CommandParser.serverVersion.substr(0,10) + '</a>)</small>');
	},

	me: function(target, room, user, connection) {
		// By default, /me allows a blank message
		if (target) target = this.canTalk(target);
		if (!target) return;

		return '/me ' + target;
	},

	mee: function(target, room, user, connection) {
		// By default, /mee allows a blank message
		if (target) target = this.canTalk(target);
		if (!target) return;

		return '/mee ' + target;
	},

	avatar: function(target, room, user) {
		if (!target) return this.parse('/avatars');
		var parts = target.split(',');
		var avatar = parseInt(parts[0]);
		if (!avatar || avatar > 294 || avatar < 1) {
			if (!parts[1]) {
				this.sendReply("Invalid avatar.");
			}
			return false;
		}

		user.avatar = avatar;
		if (!parts[1]) {
			this.sendReply("Avatar changed to:\n" +
					'|raw|<img src="//play.pokemonshowdown.com/sprites/trainers/'+avatar+'.png" alt="" width="80" height="80" />');
		}
	},

	logout: function(target, room, user) {
		user.resetName();
	},

	r: 'reply',
	reply: function(target, room, user) {
		if (!target) return this.parse('/help reply');
		if (!user.lastPM) {
			return this.sendReply('No one has PMed you yet.');
		}
		return this.parse('/msg '+(user.lastPM||'')+', '+target);
	},

	pm: 'msg',
	whisper: 'msg',
	w: 'msg',
	msg: function(target, room, user) {
		if (!target) return this.parse('/help msg');
		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!target) {
			this.sendReply('You forgot the comma.');
			return this.parse('/help msg');
		}
		if (!targetUser || !targetUser.connected) {
			if (targetUser && !targetUser.connected) {
				this.popupReply('User '+this.targetUsername+' is offline.');
			} else if (!target) {
				this.popupReply('User '+this.targetUsername+' not found. Did you forget a comma?');
			} else {
				this.popupReply('User '+this.targetUsername+' not found. Did you misspell their name?');
			}
			return this.parse('/help msg');
		}

		if (config.pmmodchat) {
			var userGroup = user.group;
			if (config.groupsranking.indexOf(userGroup) < config.groupsranking.indexOf(config.pmmodchat)) {
				var groupName = config.groups[config.pmmodchat].name;
				if (!groupName) groupName = config.pmmodchat;
				this.popupReply('Because moderated chat is set, you must be of rank ' + groupName +' or higher to PM users.');
				return false;
			}
		}

		if (user.locked && !targetUser.can('lock', user)) {
			return this.popupReply('You can only private message members of the moderation team (users marked by %, @, &, or ~) when locked.');
		}
		if (targetUser.locked && !user.can('lock', targetUser)) {
			return this.popupReply('This user is locked and cannot PM.');
		}
		if (targetUser.ignorePMs && !user.can('lock')) {
			if (!targetUser.can('lock')) {
				return this.popupReply('This user is blocking Private Messages right now.');
			} else if (targetUser.can('hotpatch')) {
				return this.popupReply('This admin is too busy to answer Private Messages right now. Please contact a different staff member.');
			}
		}

		target = this.canTalk(target, null);
		if (!target) return false;

		var message = '|pm|'+user.getIdentity()+'|'+targetUser.getIdentity()+'|'+target;
		user.send(message);
		if (targetUser !== user) targetUser.send(message);
		targetUser.lastPM = user.userid;
		user.lastPM = targetUser.userid;
	},

	blockpm: 'ignorepms',
	blockpms: 'ignorepms',
	ignorepm: 'ignorepms',
	ignorepms: function(target, room, user) {
		if (user.ignorePMs) return this.sendReply('You are already blocking Private Messages!');
		if (user.can('lock') && !user.can('hotpatch')) return this.sendReply('You are not allowed to block Private Messages.');
		user.ignorePMs = true;
		return this.sendReply('You are now blocking Private Messages.');
	},

	unblockpm: 'unignorepms',
	unblockpms: 'unignorepms',
	unignorepm: 'unignorepms',
	unignorepms: function(target, room, user) {
		if (!user.ignorePMs) return this.sendReply('You are not blocking Private Messages!');
		user.ignorePMs = false;
		return this.sendReply('You are no longer blocking Private Messages.');
	},

	makechatroom: function(target, room, user) {
		if (!this.can('makeroom')) return;
		var id = toId(target);
		if (!id) return this.parse('/help makechatroom');
		if (Rooms.rooms[id]) {
			return this.sendReply("The room '"+target+"' already exists.");
		}
		if (Rooms.global.addChatRoom(target)) {
			return this.sendReply("The room '"+target+"' was created.");
		}
		return this.sendReply("An error occurred while trying to create the room '"+target+"'.");
	},

	deregisterchatroom: function(target, room, user) {
		if (!this.can('makeroom')) return;
		var id = toId(target);
		if (!id) return this.parse('/help deregisterchatroom');
		var targetRoom = Rooms.get(id);
		if (!targetRoom) return this.sendReply("The room '"+id+"' doesn't exist.");
		target = targetRoom.title || targetRoom.id;
		if (Rooms.global.deregisterChatRoom(id)) {
			this.sendReply("The room '"+target+"' was deregistered.");
			this.sendReply("It will be deleted as of the next server restart.");
			return;
		}
		return this.sendReply("The room '"+target+"' isn't registered.");
	},

	privateroom: function(target, room, user) {
		if (!this.can('privateroom', null, room)) return;
		if (target === 'off') {
			delete room.isPrivate;
			this.addModCommand(user.name+' made this room public.');
			if (room.chatRoomData) {
				delete room.chatRoomData.isPrivate;
				Rooms.global.writeChatRoomData();
			}
		} else {
			room.isPrivate = true;
			this.addModCommand(user.name+' made this room private.');
			if (room.chatRoomData) {
				room.chatRoomData.isPrivate = true;
				Rooms.global.writeChatRoomData();
			}
		}
	},

	officialchatroom: 'officialroom',
	officialroom: function(target, room, user) {
		if (!this.can('makeroom')) return;
		if (!room.chatRoomData) {
			return this.sendReply("/officialroom - This room can't be made official");
		}
		if (target === 'off') {
			delete room.isOfficial;
			this.addModCommand(user.name+' made this chat room unofficial.');
			delete room.chatRoomData.isOfficial;
			Rooms.global.writeChatRoomData();
		} else {
			room.isOfficial = true;
			this.addModCommand(user.name+' made this chat room official.');
			room.chatRoomData.isOfficial = true;
			Rooms.global.writeChatRoomData();
		}
	},

	roomowner: function(target, room, user) {
		if (!room.chatRoomData) {
			return this.sendReply("/roomowner - This room isn't designed for per-room moderation to be added");
		}
		var target = this.splitTarget(target, true);
		var targetUser = this.targetUser;

		if (!targetUser) return this.sendReply("User '"+this.targetUsername+"' is not online.");

		if (!this.can('makeroom', targetUser, room)) return false;

		if (!room.auth) room.auth = room.chatRoomData.auth = {};

		var name = targetUser.name;

		room.auth[targetUser.userid] = '#';
		this.addModCommand(''+name+' was appointed Room Owner by '+user.name+'.');
		room.onUpdateIdentity(targetUser);
		Rooms.global.writeChatRoomData();
	},

	roomdeowner: 'deroomowner',
	deroomowner: function(target, room, user) {
		if (!room.auth) {
			return this.sendReply("/roomdeowner - This room isn't designed for per-room moderation");
		}
		var target = this.splitTarget(target, true);
		var targetUser = this.targetUser;
		var name = this.targetUsername;
		var userid = toId(name);
		if (!userid || userid === '') return this.sendReply("User '"+name+"' does not exist.");

		if (room.auth[userid] !== '#') return this.sendReply("User '"+name+"' is not a room owner.");
		if (!this.can('makeroom', null, room)) return false;

		delete room.auth[userid];
		this.sendReply('('+name+' is no longer Room Owner.)');
		if (targetUser) targetUser.updateIdentity();
		if (room.chatRoomData) {
			Rooms.global.writeChatRoomData();
		}
	},

	roomdesc: function(target, room, user) {
		if (!target) {
			if (!this.canBroadcast()) return;
			var re = /(https?:\/\/(([-\w\.]+)+(:\d+)?(\/([\w/_\.]*(\?\S+)?)?)?))/g;
			if (!room.desc) return this.sendReply("This room does not have a description set.");
			this.sendReplyBox('The room description is: '+room.desc.replace(re, "<a href=\"$1\">$1</a>"));
			return;
		}
		if (!this.can('roommod', null, room)) return false;
		if (target.length > 80) {
			return this.sendReply('Error: Room description is too long (must be at most 80 characters).');
		}

		room.desc = target;
		this.sendReply('(The room description is now: '+target+')');

		if (room.chatRoomData) {
			room.chatRoomData.desc = room.desc;
			Rooms.global.writeChatRoomData();
		}
	},

	roomdemote: 'roompromote',
	roompromote: function(target, room, user, connection, cmd) {
		if (!room.auth) {
			this.sendReply("/roompromote - This room isn't designed for per-room moderation");
			return this.sendReply("Before setting room mods, you need to set it up with /roomowner");
		}
		if (!target) return this.parse('/help roompromote');

		var target = this.splitTarget(target, true);
		var targetUser = this.targetUser;
		var userid = toUserid(this.targetUsername);
		var name = targetUser ? targetUser.name : this.targetUsername;

		if (!userid) {
			if (target && config.groups[target]) {
				var groupid = config.groups[target].id;
				return this.sendReply("/room"+groupid+" [username] - Promote a user to "+groupid+" in this room only");
			}
			return this.parse("/help roompromote");
		}
		var currentGroup = (room.auth[userid] || ' ');
		if (!targetUser && !room.auth[userid]) {
			return this.sendReply("User '"+this.targetUsername+"' is offline and unauthed, and so can't be promoted.");
		}

		var nextGroup = target || Users.getNextGroupSymbol(currentGroup, cmd === 'roomdemote', true);
		if (target === 'deauth') nextGroup = config.groupsranking[0];
		if (!config.groups[nextGroup]) {
			return this.sendReply('Group \'' + nextGroup + '\' does not exist.');
		}
		if (config.groups[nextGroup].globalonly) {
			return this.sendReply('Group \'room' + config.groups[nextGroup].id + '\' does not exist as a room rank.');
		}
		if (currentGroup !== ' ' && !user.can('room'+config.groups[currentGroup].id, null, room)) {
			return this.sendReply('/' + cmd + ' - Access denied for promoting from '+config.groups[currentGroup].name+'.');
		}
		if (nextGroup !== ' ' && !user.can('room'+config.groups[nextGroup].id, null, room)) {
			return this.sendReply('/' + cmd + ' - Access denied for promoting to '+config.groups[nextGroup].name+'.');
		}
		if (currentGroup === nextGroup) {
			return this.sendReply("User '"+this.targetUsername+"' is already a "+(config.groups[nextGroup].name || 'regular user')+" in this room.");
		}
		if (config.groups[nextGroup].globalonly) {
			return this.sendReply("The rank of "+config.groups[nextGroup].name+" is global-only and can't be room-promoted to.");
		}

		var isDemotion = (config.groups[nextGroup].rank < config.groups[currentGroup].rank);
		var groupName = (config.groups[nextGroup].name || nextGroup || '').trim() || 'a regular user';

		if (nextGroup === ' ') {
			delete room.auth[userid];
		} else {
			room.auth[userid] = nextGroup;
		}

		if (isDemotion) {
			this.privateModCommand('('+name+' was appointed to Room ' + groupName + ' by '+user.name+'.)');
			if (targetUser) {
				targetUser.popup('You were appointed to Room ' + groupName + ' by ' + user.name + '.');
			}
		} else {
			this.addModCommand(''+name+' was appointed to Room ' + groupName + ' by '+user.name+'.');
		}
		if (targetUser) {
			targetUser.updateIdentity();
		}
		if (room.chatRoomData) {
			Rooms.global.writeChatRoomData();
		}
	},

	autojoin: function(target, room, user, connection) {
		Rooms.global.autojoinRooms(user, connection);
	},

	join: function(target, room, user, connection) {
		if (!target) return false;
		var targetRoom = Rooms.get(target) || Rooms.get(toId(target));
		if (!targetRoom) {
			if (target === 'lobby') return connection.sendTo(target, "|noinit|nonexistent|");
			return connection.sendTo(target, "|noinit|nonexistent|The room '"+target+"' does not exist.");
		}
		if (targetRoom.isPrivate && !user.named) {
			return connection.sendTo(target, "|noinit|namerequired|You must have a name in order to join the room '"+target+"'.");
		}
		if (!user.joinRoom(targetRoom || room, connection)) {
			return connection.sendTo(target, "|noinit|joinfailed|The room '"+target+"' could not be joined.");
		}
		if (target.toLowerCase() === 'lobby') {
			return connection.sendTo('lobby', '|html|<center><img src="http://i.imgur.com/a2M11uZ.png"><br><br><b>League of a Thousand Years</b>' +
			'<br><br>Welcome to the Jasmine league, you can find our website <a href="http://leaf-league.weebly.com/">here</a> and our ' +
			' forum <a href="http://leaf-league.forumotion.com/">here</a>.<br><br>The league is home of two regions: <font color="green">Celestia</font>' +
			' and <font color="green">Saraphia</font> home to their own Gym Leaders, Elite Four and Champion!<br><br>' +
			'<i><font size="0.5" color="green">"Tempest has been lain to ashes but is reborn like a phoenix. The Phoenix succumbs to the grace of a leaf ' +
			'blowing in the wind; and like a leaf you ride the winds of fate elegantly. Fate calls that leaf to lie upon a jasmine, which shall ignite with refined oppurtunity."</font></i></center>');
		}
	},

	rb: 'roomban',
	roomban: function(target, room, user, connection) {
		if (!target) return this.parse('/help roomban');
		target = this.splitTarget(target, true);
		var targetUser = this.targetUser;
		var name = this.targetUsername;
		var userid = toId(name);
		if (!userid || !targetUser) return this.sendReply("User '" + name + "' does not exist.");
		if (!this.can('ban', targetUser, room)) return false;
		if (!Rooms.rooms[room.id].users[userid] && room.isPrivate) {
			return this.sendReply('User ' + this.targetUsername + ' is not in the room ' + room.id + '.');
		}
		if (!room.bannedUsers || !room.bannedIps) {
			return this.sendReply('Room bans are not meant to be used in room ' + room.id + '.');
		}
		room.bannedUsers[userid] = true;
		for (var ip in targetUser.ips) {
			room.bannedIps[ip] = true;
		}
		targetUser.popup(user.name+" has banned you from the room " + room.id + ". To appeal the ban, PM the moderator that banned you or a room owner." + (target ? " (" + target + ")" : ""));
		this.addModCommand(""+targetUser.name+" was banned from room " + room.id + " by "+user.name+"." + (target ? " (" + target + ")" : ""));
		var alts = targetUser.getAlts();
		if (alts.length) {
			this.addModCommand(""+targetUser.name+"'s alts were also banned from room " + room.id + ": "+alts.join(", "));
			for (var i = 0; i < alts.length; ++i) {
				var altId = toId(alts[i]);
				this.add('|unlink|' + altId);
				room.bannedUsers[altId] = true;
			}
		}
		this.add('|unlink|' + targetUser.userid);
		targetUser.leaveRoom(room.id);
	},

	roomunban: function(target, room, user, connection) {
		if (!target) return this.parse('/help roomunban');
		target = this.splitTarget(target, true);
		var targetUser = this.targetUser;
		var name = this.targetUsername;
		var userid = toId(name);
		if (!userid || !targetUser) return this.sendReply("User '"+name+"' does not exist.");
		if (!this.can('ban', targetUser, room)) return false;
		if (!room.bannedUsers || !room.bannedIps) {
			return this.sendReply('Room bans are not meant to be used in room ' + room.id + '.');
		}
		if (room.bannedUsers[userid]) delete room.bannedUsers[userid];
		for (var ip in targetUser.ips) {
			if (room.bannedIps[ip]) delete room.bannedIps[ip];
		}
		targetUser.popup(user.name+" has unbanned you from the room " + room.id + ".");
		this.addModCommand(""+targetUser.name+" was unbanned from room " + room.id + " by "+user.name+".");
		var alts = targetUser.getAlts();
		if (alts.length) {
			this.addModCommand(""+targetUser.name+"'s alts were also unbanned from room " + room.id + ": "+alts.join(", "));
			for (var i = 0; i < alts.length; ++i) {
				var altId = toId(alts[i]);
				if (room.bannedUsers[altId]) delete room.bannedUsers[altId];
			}
		}
	},

	roomauth: function(target, room, user, connection) {
		if (!room.auth) return this.sendReply("/roomauth - This room isn't designed for per-room moderation and therefore has no auth list.");
		var buffer = [];
		for (var u in room.auth) {
			buffer.push(room.auth[u] + u);
		}
		if (buffer.length > 0) {
			buffer = buffer.join(', ');
		} else {
			buffer = 'This room has no auth.';
		}
		connection.popup(buffer);
	},
	
	stafflist: function(target, room, user, connection) {
        	var buffer = [];
        	var admins = [];
        	var leaders = [];
        	var mods = [];
        	var drivers = [];
        	var voices = [];
        
        	admins2 = ''; leaders2 = ''; mods2 = ''; drivers2 = ''; voices2 = ''; 
        	stafflist = fs.readFileSync('config/usergroups.csv','utf8');
        	stafflist = stafflist.split('\n');
        	for (var u in stafflist) {
        	    line = stafflist[u].split(',');
				if (line[1] == '~') { 
        	        admins2 = admins2 +line[0]+',';
        	    } 
        	    if (line[1] == '&') { 
        	        leaders2 = leaders2 +line[0]+',';
        	    }
        	    if (line[1] == '@') { 
        	        mods2 = mods2 +line[0]+',';
        	    } 
        	    if (line[1] == '%') { 
        	        drivers2 = drivers2 +line[0]+',';
        	    } 
        	    if (line[1] == '+') { 
        	        voices2 = voices2 +line[0]+',';
        	     } 
        	}
        	admins2 = admins2.split(',');
        	leaders2 = leaders2.split(',');
        	mods2 = mods2.split(',');
        	drivers2 = drivers2.split(',');
        	voices2 = voices2.split(',');
        	for (var u in admins2) {
		     if (admins2[u] != '') admins.push(admins2[u]);
        	}
        	for (var u in leaders2) {
        	    if (leaders2[u] != '') leaders.push(leaders2[u]);
        	}
        	for (var u in mods2) {
        	    if (mods2[u] != '') mods.push(mods2[u]);
        	}
        	for (var u in drivers2) {
        	    if (drivers2[u] != '') drivers.push(drivers2[u]);
        	}
        	for (var u in voices2) {
        	    if (voices2[u] != '') voices.push(voices2[u]);
        	}
        	if (admins.length > 0) {
        	    admins = admins.join(', ');
        	}
        	if (leaders.length > 0) {
        	    leaders = leaders.join(', ');
        	}
        	if (mods.length > 0) {
        	    mods = mods.join(', ');
        	}
        	if (drivers.length > 0) {
        	    drivers = drivers.join(', ');
        	}
        	if (voices.length > 0) {
        	    voices = voices.join(', ');
        	}
        	connection.popup('Administrators: \n'+admins+'\nLeaders: \n'+leaders+'\nModerators: \n'+mods+'\nDrivers: \n'+drivers+'\nVoices: \n'+voices);
	 },	

	leave: 'part',
	part: function(target, room, user, connection) {
		if (room.id === 'global') return false;
		var targetRoom = Rooms.get(target);
		if (target && !targetRoom) {
			return this.sendReply("The room '"+target+"' does not exist.");
		}
		user.leaveRoom(targetRoom || room, connection);
	},

	/*********************************************************
	 * Other Commands
	 *********************************************************/

	 setmember: function(target, room, user) {
	 	if (!this.can('permaban')) return false;
	 	if (!target) return this.sendReply('/setmember [username], [position], [type - optional]');

		var targets = target.split(', ');
		target = targets[1];
		var targetUser = targets[0];

	 	if (!targetUser) return this.sendReply('You need to add the name of a member to add.');
	 	if (!target) return this.sendReply('You need to add a position for the member.');

	 	var position = toId(target);
	 	var removeMember = false;
	 	var corPos = false;

	 	if (position != 'champion' && position != 'elitefour' && position != 'professor' && position != 'frontier' && position != 'gymleader' && position != 'gymtrainer') {
	 		if (position != 'remove') {
				return this.sendReply('The position should be either: Champion, Elite Four, Professor, Frontier, Gym Leader or Gym Trainer.');
			} else if (position === 'remove') {
				removeMember = true;
			} else return this.sendReply('Errrrrrrrorrrrrrrrr');
	 	}
	 	else {
	 		corPos = true;
	 	}

	 	if (!removeMember) {
	 		switch(position) {
	 			case 'champion':
		 		position = 'Champion';
		 		break;
	 			case 'elitefour':
	 			position = 'Elite Four';
		 		break;
		 		case 'professor':
	 			position = 'Professor';
	 			break;
	 			case 'frontier':
		 		position = 'Frontier';
		 		break;
	 			case 'gymleader':
	 			position = 'Gym Leader';
		 		break;
		 		case 'gymtrainer':
	 			position = 'Gym Trainer';
	 			break;
		 		default:
		 		return this.sendReply('SOMETHING BROKE ABANDON SHIP!');
	 		}
	 	}
	 	var data = fs.readFileSync('config/members.csv', 'utf8');
        var rows = data.split("\n");
        var matched = false;
        var line = '';
        var rePosition = '';
        for (var i = 0; i < rows.length; i++) {
                if (!rows[i]) continue;
                var parts = rows[i].split(",");
                var userName = parts[0];
                if (targetUser === userName) {
                        matched = true;
                        rePosition = parts[1];
                        line += rows[i];
                        break;
                }
    	}
    	rePosition = position;
    	if (matched) {
    		var re = new RegExp(line,"g");
                fs.readFile('config/members.csv', 'utf8', function (err,data) {
                        if (err) {
                                return console.log(err);
                        }
                        if (removeMember) {
                        	var result = data.replace(re, '');
                        	fs.writeFile('config/members.csv', result, 'utf8', function (err) {
                                if (err) return console.log(err);
                        });
                        	return user.sendReply(targetUser+' has been removed from the members file.');
                        }
                        var result = data.replace(re, targetUser+','+rePosition);
                        fs.writeFile('config/members.csv', result, 'utf8', function (err) {
                                if (err) return console.log(err);
                        });
                });
        } else {
                fs.appendFile('config/members.csv',"\n"+targetUser+','+rePosition);
        }
        return this.sendReply(targetUser+' has been saved as '+rePosition+'.');
	 },	

	 viewmembers: function(target, room, user) {
	 	if (!this.canBroadcast()) return;
	 	var txtColour = 'green';
	 	if (!target) {
	 		var data = fs.readFileSync('config/members.csv', 'utf8');
			var rows = data.split("\n");
			var matched = false;
			var champion = [];
			var elite = [];
			var professors = [];
			var frontiers = [];
			var leaders = [];
			var trainers = [];
			for (var i = 0; i < rows.length; i++) {
				if (!rows[i]) continue;
				var parts = rows[i].split(",");
				var userName = parts[0];
				if (toId(parts[1]) === 'gymtrainer') {
					trainers.push(userName);
				}
				else if (toId(parts[1]) === 'gymleader') {
					leaders.push(userName);
				} else if (toId(parts[1]) === 'frontier') {
					frontiers.push(userName);
				} else if (toId(parts[1]) === 'professor') {
					professors.push(userName);
				} else if (toId(parts[1]) === 'elitefour') {
					elite.push(userName);
				} else if (toId(parts[1]) === 'champion') {
					champion.push(userName);
				} else return this.sendReply('You hacked and broked me :(');

			}
			var results = '';
			results += '<font color="'+txtColour+'"><b>Champion(s):</b></font><br>';
			if (champion.length > 0) results += champion.join(', ') + '<br>';
			else results += 'No Champion<br>';
			results += '<font color="'+txtColour+'"><b>Elite Four:</b></font><br>';
			if (elite.length > 0) results += elite.join(', ') + '<br>';
			else results += 'No Elite Four<br>';
			results += '<font color="'+txtColour+'"><b>Professors:</b></font><br>';
			if (professors.length > 0) results += professors.join(', ') + '<br>';
			else results += 'No Professors<br>';
			results += '<font color="'+txtColour+'"><b>Frontier:</b></font><br>';
			if (frontiers.length > 0) results += frontiers.join(', ') + '<br>';
			else results += 'No Frontier<br>';
			results += '<font color="'+txtColour+'"><b>Gym Leaders:</b></font><br>';
			if (leaders.length > 0) results += leaders.join(', ') + '<br>';
			else results += 'No Gym Leaders<br>';
			results += '<font color="'+txtColour+'"><b>Gym Trainers:</b></font><br>';
			if (trainers.length > 0) results += trainers.join(', ') + '<br>';
			else results += 'No Gym Trainers<br>';

			return this.sendReplyBox(results);
	 	}
	 	else {
	 		var data = fs.readFileSync('config/members.csv', 'utf8');
			var rows = data.split("\n");
			var output = [];
			var search = toId(target);
			for (var i = 0; i < rows.length; i++) {
				if (!rows[i]) continue;
				var parts = rows[i].split(",");
				var userName = parts[0];
				var kek = false;
				switch (search) {
					case 'champion':
						if (toId(parts[1]) === 'champion') output.push(userName); 
						break;
					case 'elitefour':
						if (toId(parts[1]) === 'elitefour') output.push(userName);
						break;
					case 'professors':
						if (toId(parts[1]) === 'professor') output.push(userName); 
						break;
					case 'frontier':
						if (toId(parts[1]) === 'fronter') output.push(userName); 
						break;
					case 'gymleaders':
						if (toId(parts[1]) === 'gymleader') output.push(userName); 
						break;
					case 'gymtrainers':
						if (toId(parts[1]) === 'gymtrainer') output.push(userName); 
						break;
					default:
						kek = true;
				}
				if (kek) return this.sendReply('The position should be either: Champion, Elite Four, Professors, Frontier, Gym Leaders or Gym Trainers.');
			}
			var results = [];
			var kek = false;

			switch (search) {
				case 'champion':
					results += '<font color="'+txtColour+'"><b>Champion(s):</b></font><br>';
					if (output.length === 2) results += output[0] + ' and ' + output[1];
					else results += output.join(', ');
					break;
				case 'elitefour':
					results += '<font color="'+txtColour+'"><b>Elite Four:</b></font><br>';
					results += output.join(', ');
					break;
				case 'professors':
					results += '<font color="'+txtColour+'"><b>Professors:</b></font><br>';
					results += output.join(', ');
					break;
				case 'frontier':
					results += '<font color="'+txtColour+'"><b>Frontier:</b></font><br>';
					results += output.join(', ');
					break;
				case 'gymleaders':
					results += '<font color="'+txtColour+'"><b>Gym Leaders:</b></font><br>';
					results += output.join(', ');
					break;
				case 'gymtrainers':
					results += '<font color="'+txtColour+'"><b>Gym Trainers:</b></font><br>';
					results += output.join(', ');
					break;
				default:
					kek = true;
					break;
			}
			if (output.length === 0) results = 'This position does not have any members set as it';
			if (kek) return this.sendReply('SOMETHING BROKE, EMPTY THE VAULT AND BURN THE RECEIPTS!');

			return this.sendReplyBox(results);
	 	}
	 },

	hide: function(target, room, user) {
        if (this.can('hide')) {
        	user.getIdentity = function(){
                if(this.muted)        return '!' + this.name;
                if(this.locked) return '‽' + this.name;
                return ' ' + this.name;
            };
            user.updateIdentity();
            this.sendReply('You have hidden your staff symbol.');
            return false;
        }
	},

    show: function(target, room, user) {
        if (this.can('hide')) {
            delete user.getIdentity
            user.updateIdentity();
            this.sendReply('You have revealed your staff symbol');
            return false;
        }
    },

    eating: 'away',
	gaming: 'away',
    sleep: 'away',
    work: 'away',
    working: 'away',
    sleeping: 'away',
    busy: 'away',    
	afk: 'away',
	away: function(target, room, user, connection, cmd) {
		if (!this.can('away')) return false;
		var t = 'Away';
		switch (cmd) {
			case 'busy':
			t = 'Busy';
			break;
			case 'sleeping':
			t = 'Sleeping';
			break;
			case 'sleep':
			t = 'Sleeping';
			break;
			case 'gaming':
			t = 'Gaming';
			break;
			case 'working':
			t = 'Working';
			break;
			case 'work':
			t = 'Working';
			break;
			case 'eating':
			t = 'Eating';
			break;
			default:
			t = 'Away'
			break;
		}

		if (user.name.length > 18) return this.sendReply('Your username exceeds the length limit.');

		if (!user.isAway) {
			user.originalName = user.name;
			var awayName = user.name + ' - '+t;
			//delete the user object with the new name in case it exists - if it does it can cause issues with forceRename
			delete Users.get(awayName);
			user.forceRename(awayName, undefined, true);

			if (user.isStaff) this.add('|raw|-- <b><font color="#088cc7">' + user.originalName +'</font color></b> is now '+t.toLowerCase()+'. '+ (target ? " (" + target + ")" : ""));

			user.isAway = true;
		}
		else {
			return this.sendReply('You are already set as a form of away, type /back if you are now back.');
		}

		user.updateIdentity();
	},

	back: function(target, room, user, connection) {
		if (!this.can('away')) return false;

		if (user.isAway) {
			if (user.name === user.originalName) {
				user.isAway = false; 
				return this.sendReply('Your name has been left unaltered and no longer marked as away.');
			}

			var newName = user.originalName;

			//delete the user object with the new name in case it exists - if it does it can cause issues with forceRename
			delete Users.get(newName);

			user.forceRename(newName, undefined, true);

			//user will be authenticated
			user.authenticated = true;

			if (user.isStaff) this.add('|raw|-- <b><font color="#088cc7">' + newName + '</font color></b> is no longer away.');

			user.originalName = '';
			user.isAway = false;
		}
		else {
			return this.sendReply('You are not set as away.');
		}

		user.updateIdentity();
	}, 

	/*********************************************************
	 * Moderating: Punishments
	 *********************************************************/

	kick: 'warn',
	k: 'warn',
	warn: function(target, room, user) {
		if (!target) return this.parse('/help warn');

		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser || !targetUser.connected) {
			return this.sendReply('User '+this.targetUsername+' not found.');
		}
		if (room.isPrivate && room.auth) {
			return this.sendReply('You can\'t warn here: This is a privately-owned room not subject to global rules.');
		}
		if (target.length > MAX_REASON_LENGTH) {
			return this.sendReply('The reason is too long. It cannot exceed ' + MAX_REASON_LENGTH + ' characters.');
		}
		if (!this.can('warn', targetUser, room)) return false;

		this.addModCommand(''+targetUser.name+' was warned by '+user.name+'.' + (target ? " (" + target + ")" : ""));
		targetUser.send('|c|~|/warn '+target);
		this.add('|unlink|' + targetUser.userid);
	},

	redirect: 'redir',
	redir: function (target, room, user, connection) {
		if (!target) return this.parse('/help redirect');
		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		var targetRoom = Rooms.get(target) || Rooms.get(toId(target));
		if (!targetRoom) {
			return this.sendReply("The room '" + target + "' does not exist.");
		}
		if (!this.can('warn', targetUser, room) || !this.can('warn', targetUser, targetRoom)) return false;
		if (!targetUser || !targetUser.connected) {
			return this.sendReply('User '+this.targetUsername+' not found.');
		}
		if (Rooms.rooms[targetRoom.id].users[targetUser.userid]) {
			return this.sendReply("User " + targetUser.name + " is already in the room " + target + "!");
		}
		if (!Rooms.rooms[room.id].users[targetUser.userid]) {
			return this.sendReply('User '+this.targetUsername+' is not in the room ' + room.id + '.');
		}
		if (targetUser.joinRoom(target) === false) return this.sendReply('User "' + targetUser.name + '" could not be joined to room ' + target + '. They could be banned from the room.');
		var roomName = (targetRoom.isPrivate)? 'a private room' : 'room ' + targetRoom.title;
		this.addModCommand(targetUser.name + ' was redirected to ' + roomName + ' by ' + user.name + '.');
		targetUser.leaveRoom(room);
	},

	m: 'mute',
	mute: function(target, room, user) {
		if (!target) return this.parse('/help mute');

		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser) {
			return this.sendReply('User '+this.targetUsername+' not found.');
		}
		if (target.length > MAX_REASON_LENGTH) {
			return this.sendReply('The reason is too long. It cannot exceed ' + MAX_REASON_LENGTH + ' characters.');
		}
		if (!this.can('mute', targetUser, room)) return false;
		if (targetUser.mutedRooms[room.id] || targetUser.locked || !targetUser.connected) {
			var problem = ' but was already '+(!targetUser.connected ? 'offline' : targetUser.locked ? 'locked' : 'muted');
			if (!target) {
				return this.privateModCommand('('+targetUser.name+' would be muted by '+user.name+problem+'.)');
			}
			return this.addModCommand(''+targetUser.name+' would be muted by '+user.name+problem+'.' + (target ? " (" + target + ")" : ""));
		}

		targetUser.popup(user.name+' has muted you for 7 minutes. '+target);
		this.addModCommand(''+targetUser.name+' was muted by '+user.name+' for 7 minutes.' + (target ? " (" + target + ")" : ""));
		var alts = targetUser.getAlts();
		if (alts.length) this.addModCommand(""+targetUser.name+"'s alts were also muted: "+alts.join(", "));
		this.add('|unlink|' + targetUser.userid);

		targetUser.mute(room.id, 7*60*1000);
	},

	hm: 'hourmute',
	hourmute: function(target, room, user) {
		if (!target) return this.parse('/help hourmute');

		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser) {
			return this.sendReply('User '+this.targetUsername+' not found.');
		}
		if (target.length > MAX_REASON_LENGTH) {
			return this.sendReply('The reason is too long. It cannot exceed ' + MAX_REASON_LENGTH + ' characters.');
		}
		if (!this.can('mute', targetUser, room)) return false;

		if (((targetUser.mutedRooms[room.id] && (targetUser.muteDuration[room.id]||0) >= 50*60*1000) || targetUser.locked) && !target) {
			var problem = ' but was already '+(!targetUser.connected ? 'offline' : targetUser.locked ? 'locked' : 'muted');
			return this.privateModCommand('('+targetUser.name+' would be muted by '+user.name+problem+'.)');
		}

		targetUser.popup(user.name+' has muted you for 60 minutes. '+target);
		this.addModCommand(''+targetUser.name+' was muted by '+user.name+' for 60 minutes.' + (target ? " (" + target + ")" : ""));
		var alts = targetUser.getAlts();
		if (alts.length) this.addModCommand(""+targetUser.name+"'s alts were also muted: "+alts.join(", "));
		this.add('|unlink|' + targetUser.userid);

		targetUser.mute(room.id, 60*60*1000, true);
	},

	um: 'unmute',
	unmute: function(target, room, user) {
		if (!target) return this.parse('/help unmute');
		var targetUser = Users.get(target);
		if (!targetUser) {
			return this.sendReply('User '+target+' not found.');
		}
		if (!this.can('mute', targetUser, room)) return false;

		if (!targetUser.mutedRooms[room.id]) {
			return this.sendReply(''+targetUser.name+' isn\'t muted.');
		}

		this.addModCommand(''+targetUser.name+' was unmuted by '+user.name+'.');

		targetUser.unmute(room.id);
	},

	l: 'lock',
	ipmute: 'lock',
	lock: function(target, room, user) {
		if (!target) return this.parse('/help lock');

		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser) {
			return this.sendReply('User '+this.targetUser+' not found.');
		}
		if (target.length > MAX_REASON_LENGTH) {
			return this.sendReply('The reason is too long. It cannot exceed ' + MAX_REASON_LENGTH + ' characters.');
		}
		if (!user.can('lock', targetUser)) {
			return this.sendReply('/lock - Access denied.');
		}

		if ((targetUser.locked || Users.checkBanned(targetUser.latestIp)) && !target) {
			var problem = ' but was already '+(targetUser.locked ? 'locked' : 'banned');
			return this.privateModCommand('('+targetUser.name+' would be locked by '+user.name+problem+'.)');
		}

		targetUser.popup(user.name+' has locked you from talking in chats, battles, and PMing regular users.\n\n'+target+'\n\nIf you feel that your lock was unjustified, you can still PM staff members (%, @, &, and ~) to discuss it.');

		this.addModCommand(""+targetUser.name+" was locked from talking by "+user.name+"." + (target ? " (" + target + ")" : ""));
		var alts = targetUser.getAlts();
		if (alts.length) this.addModCommand(""+targetUser.name+"'s alts were also locked: "+alts.join(", "));
		this.add('|unlink|' + targetUser.userid);

		targetUser.lock();
	},

	unlock: function(target, room, user) {
		if (!target) return this.parse('/help unlock');
		if (!this.can('lock')) return false;

		var unlocked = Users.unlock(target);

		if (unlocked) {
			var names = Object.keys(unlocked);
			this.addModCommand('' + names.join(', ') + ' ' +
					((names.length > 1) ? 'were' : 'was') +
					' unlocked by ' + user.name + '.');
		} else {
			this.sendReply('User '+target+' is not locked.');
		}
	},

	b: 'ban',
	ban: function(target, room, user) {
		if (!target) return this.parse('/help ban');

		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser) {
			return this.sendReply('User '+this.targetUsername+' not found.');
		}
		if (target.length > MAX_REASON_LENGTH) {
			return this.sendReply('The reason is too long. It cannot exceed ' + MAX_REASON_LENGTH + ' characters.');
		}
		if (!this.can('ban', targetUser)) return false;

		if (Users.checkBanned(targetUser.latestIp) && !target && !targetUser.connected) {
			var problem = ' but was already banned';
			return this.privateModCommand('('+targetUser.name+' would be banned by '+user.name+problem+'.)');
		}

		targetUser.popup(user.name+" has banned you." + (config.appealurl ? ("  If you feel that your banning was unjustified you can appeal the ban:\n" + config.appealurl) : "") + "\n\n"+target);

		this.addModCommand(""+targetUser.name+" was banned by "+user.name+"." + (target ? " (" + target + ")" : ""), ' ('+targetUser.latestIp+')');
		var alts = targetUser.getAlts();
		if (alts.length) {
			this.addModCommand(""+targetUser.name+"'s alts were also banned: "+alts.join(", "));
			for (var i = 0; i < alts.length; ++i) {
				this.add('|unlink|' + toId(alts[i]));
			}
		}

		this.add('|unlink|' + targetUser.userid);
		targetUser.ban();
	},

	unban: function(target, room, user) {
		if (!target) return this.parse('/help unban');
		if (!user.can('ban')) {
			return this.sendReply('/unban - Access denied.');
		}

		var name = Users.unban(target);

		if (name) {
			this.addModCommand(''+name+' was unbanned by '+user.name+'.');
		} else {
			this.sendReply('User '+target+' is not banned.');
		}
	},

	unbanall: function(target, room, user) {
		if (!user.can('ban')) {
			return this.sendReply('/unbanall - Access denied.');
		}
		// we have to do this the hard way since it's no longer a global
		for (var i in Users.bannedIps) {
			delete Users.bannedIps[i];
		}
		for (var i in Users.lockedIps) {
			delete Users.lockedIps[i];
		}
		this.addModCommand('All bans and locks have been lifted by '+user.name+'.');
	},

	banip: function(target, room, user) {
		target = target.trim();
		if (!target) {
			return this.parse('/help banip');
		}
		if (!this.can('rangeban')) return false;

		Users.bannedIps[target] = '#ipban';
		this.addModCommand(user.name+' temporarily banned the '+(target.charAt(target.length-1)==='*'?'IP range':'IP')+': '+target);
	},

	unbanip: function(target, room, user) {
		target = target.trim();
		if (!target) {
			return this.parse('/help unbanip');
		}
		if (!this.can('rangeban')) return false;
		if (!Users.bannedIps[target]) {
			return this.sendReply(''+target+' is not a banned IP or IP range.');
		}
		delete Users.bannedIps[target];
		this.addModCommand(user.name+' unbanned the '+(target.charAt(target.length-1)==='*'?'IP range':'IP')+': '+target);
	},

	/*********************************************************
	 * Moderating: Other
	 *********************************************************/

	modnote: function(target, room, user, connection, cmd) {
		if (!target) return this.parse('/help note');
		if (target.length > MAX_REASON_LENGTH) {
			return this.sendReply('The note is too long. It cannot exceed ' + MAX_REASON_LENGTH + ' characters.');
		}
		if (!this.can('mute')) return false;
		return this.privateModCommand('(' + user.name + ' notes: ' + target + ')');
	},

	demote: 'promote',
	promote: function(target, room, user, connection, cmd) {
		if (!target) return this.parse('/help promote');
		var target = this.splitTarget(target, true);
		var targetUser = this.targetUser;
		var userid = toUserid(this.targetUsername);
		var name = targetUser ? targetUser.name : this.targetUsername;

		if (!userid) {
			if (target && config.groups[target]) {
				var groupid = config.groups[target].id;
				return this.sendReply("/"+groupid+" [username] - Promote a user to "+groupid+" globally");
			}
			return this.parse("/help promote");
		}

		var currentGroup = ' ';
		if (targetUser) {
			currentGroup = targetUser.group;
		} else if (Users.usergroups[userid]) {
			currentGroup = Users.usergroups[userid].substr(0,1);
		}

		var nextGroup = target ? target : Users.getNextGroupSymbol(currentGroup, cmd === 'demote', true);
		if (target === 'deauth') nextGroup = config.groupsranking[0];
		if (!config.groups[nextGroup]) {
			return this.sendReply('Group \'' + nextGroup + '\' does not exist.');
		}
		if (config.groups[nextGroup].roomonly) {
			return this.sendReply('Group \'' + config.groups[nextGroup].id + '\' does not exist as a global rank.');
		}
		if (!user.canPromote(currentGroup, nextGroup)) {
			return this.sendReply('/' + cmd + ' - Access denied.');
		}

		var isDemotion = (config.groups[nextGroup].rank < config.groups[currentGroup].rank);
		if (!Users.setOfflineGroup(name, nextGroup)) {
			return this.sendReply('/promote - WARNING: This user is offline and could be unregistered. Use /forcepromote if you\'re sure you want to risk it.');
		}
		var groupName = (config.groups[nextGroup].name || nextGroup || '').trim() || 'a regular user';
		if (isDemotion) {
			this.privateModCommand('('+name+' was demoted to ' + groupName + ' by '+user.name+'.)');
			if (targetUser) {
				targetUser.popup('You were demoted to ' + groupName + ' by ' + user.name + '.');
			}
		} else {
			this.addModCommand(''+name+' was promoted to ' + groupName + ' by '+user.name+'.');
		}
		if (targetUser) {
			targetUser.updateIdentity();
		}
	},

	forcepromote: function(target, room, user) {
		// warning: never document this command in /help
		if (!this.can('forcepromote')) return false;
		var target = this.splitTarget(target, true);
		var name = this.targetUsername;
		var nextGroup = target ? target : Users.getNextGroupSymbol(' ', false);

		if (!Users.setOfflineGroup(name, nextGroup, true)) {
			return this.sendReply('/forcepromote - Don\'t forcepromote unless you have to.');
		}
		var groupName = config.groups[nextGroup].name || nextGroup || '';
		this.addModCommand(''+name+' was promoted to ' + (groupName.trim()) + ' by '+user.name+'.');
	},

	deauth: function(target, room, user) {
		return this.parse('/demote '+target+', deauth');
	},

	modchat: function(target, room, user) {
		if (!target) {
			return this.sendReply('Moderated chat is currently set to: '+room.modchat);
		}
		if (!this.can('modchat', null, room)) return false;
		if (room.modchat && room.modchat.length <= 1 && config.groupsranking.indexOf(room.modchat) > 1 && !user.can('modchatall', null, room)) {
			return this.sendReply('/modchat - Access denied for removing a setting higher than ' + config.groupsranking[1] + '.');
		}

		target = target.toLowerCase();
		switch (target) {
		case 'on':
		case 'true':
		case 'yes':
		case 'registered':
			this.sendReply("Modchat registered is no longer available.");
			return false;
			break;
		case 'off':
		case 'false':
		case 'no':
			room.modchat = false;
			break;
		case 'ac':
		case 'autoconfirmed':
			room.modchat = 'autoconfirmed';
			break;
		case '*':
		case 'player':
			target = '\u2605';
			// fallthrough
		default:
			if (!config.groups[target]) {
				return this.parse('/help modchat');
			}
			if (config.groupsranking.indexOf(target) > 1 && !user.can('modchatall', null, room)) {
				return this.sendReply('/modchat - Access denied for setting higher than ' + config.groupsranking[1] + '.');
			}
			room.modchat = target;
			break;
		}
		if (room.modchat === true) {
			this.add('|raw|<div class="broadcast-red"><b>Moderated chat was enabled!</b><br />Only registered users can talk.</div>');
		} else if (!room.modchat) {
			this.add('|raw|<div class="broadcast-blue"><b>Moderated chat was disabled!</b><br />Anyone may talk now.</div>');
		} else {
			var modchat = sanitize(room.modchat);
			this.add('|raw|<div class="broadcast-red"><b>Moderated chat was set to '+modchat+'!</b><br />Only users of rank '+modchat+' and higher can talk.</div>');
		}
		this.logModCommand(user.name+' set modchat to '+room.modchat);
	},

	declare: function(target, room, user) {
		if (!target) return this.parse('/help declare');
		if (!this.can('declare', null, room)) return false;

		if (!this.canTalk()) return;

		this.add('|raw|<div class="broadcast-blue"><b>'+target+'</b></div>');
		this.logModCommand(user.name+' declared '+target);
	},

	gdeclare: 'globaldeclare',
	globaldeclare: function(target, room, user) {
		if (!target) return this.parse('/help globaldeclare');
		if (!this.can('gdeclare')) return false;

		for (var id in Rooms.rooms) {
			if (id !== 'global') Rooms.rooms[id].addRaw('<div class="broadcast-blue"><b>'+target+'</b></div>');
		}
		this.logModCommand(user.name+' globally declared '+target);
	},

	cdeclare: 'chatdeclare',
	chatdeclare: function(target, room, user) {
		if (!target) return this.parse('/help chatdeclare');
		if (!this.can('gdeclare')) return false;

		for (var id in Rooms.rooms) {
			if (id !== 'global') if (Rooms.rooms[id].type !== 'battle') Rooms.rooms[id].addRaw('<div class="broadcast-blue"><b>'+target+'</b></div>');
		}
		this.logModCommand(user.name+' globally declared (chat level) '+target);
	},

	wall: 'announce',
	announce: function(target, room, user) {
		if (!target) return this.parse('/help announce');

		if (!this.can('announce', null, room)) return false;

		target = this.canTalk(target);
		if (!target) return;

		return '/announce '+target;
	},

	masspm: 'pmall',
	pmall: function(target, room, user) {
		if (!target) return this.parse('/pmall [message] - Sends a PM to every user in a room.');
		if (!this.can('pmall')) return false;

		var pmName = '~Frost PM';

		for (var i in Users.users) {
			var message = '|pm|'+pmName+'|'+Users.users[i].getIdentity()+'|'+target;
			Users.users[i].send(message);
		}
	},

	pas: 'pmallstaff',
	pmallstaff: function(target, room, user) {
		if (!target) return this.parse('/pmallstaff [message] - Sends a PM to every staff member online.');
		if (!this.can('pmall')) return false;

		for (var u in Users.users) { 
			if (Users.users[u].isStaff) {
				Users.users[u].send('|pm|~Staff PM|'+Users.users[u].group+Users.users[u].name+'|'+target);
			}
		}
	},

	fr: 'forcerename',
	forcerename: function(target, room, user) {
		if (!target) return this.parse('/help forcerename');
		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser) {
			return this.sendReply('User '+this.targetUsername+' not found.');
		}
		if (!this.can('forcerename', targetUser)) return false;

		if (targetUser.userid === toUserid(this.targetUser)) {
			var entry = ''+targetUser.name+' was forced to choose a new name by '+user.name+'' + (target ? ": " + target + "" : "");
			this.privateModCommand('(' + entry + ')');
			Rooms.global.cancelSearch(targetUser);
			targetUser.resetName();
			targetUser.send('|nametaken||'+user.name+" has forced you to change your name. "+target);
		} else {
			this.sendReply("User "+targetUser.name+" is no longer using that name.");
		}
	},
		

	modlog: function(target, room, user, connection) {
		var lines = 0;
		// Specific case for modlog command. Room can be indicated with a comma, lines go after the comma.
		// Otherwise, the text is defaulted to text search in current room's modlog.
		var roomId = room.id;
		var roomLogs = {};

		if (target.indexOf(',') > -1) {
			var targets = target.split(',');
			target = targets[1].trim();
			roomId = toId(targets[0]) || room.id;
		}

		// Let's check the number of lines to retrieve or if it's a word instead
		if (!target.match('[^0-9]')) {
			lines = parseInt(target || 15, 10);
			if (lines > 100) lines = 100;
		}
		var wordSearch = (!lines || lines < 0);

		// Control if we really, really want to check all modlogs for a word.
		var roomNames = '';
		var filename = '';
		var command = '';
		if (roomId === 'all' && wordSearch) {
			if (!this.can('modlog')) return;
			roomNames = 'all rooms';
			// Get a list of all the rooms
			var fileList = fs.readdirSync('logs/modlog');
			for (var i=0; i<fileList.length; i++) {
				filename += 'logs/modlog/' + fileList[i] + ' ';
			}
		} else {
			if (!this.can('modlog', null, Rooms.get(roomId))) return;
			roomNames = 'the room ' + roomId;
			filename = 'logs/modlog/modlog_' + roomId + '.txt';
		}

		// Seek for all input rooms for the lines or text
		command = 'tail -' + lines + ' ' + filename;
		var grepLimit = 100;
		if (wordSearch) { // searching for a word instead
			if (target.match(/^["'].+["']$/)) target = target.substring(1,target.length-1);
			command = "awk '{print NR,$0}' " + filename + " | sort -nr | cut -d' ' -f2- | grep -m"+grepLimit+" -i '"+target.replace(/\\/g,'\\\\\\\\').replace(/["'`]/g,'\'\\$&\'').replace(/[\{\}\[\]\(\)\$\^\.\?\+\-\*]/g,'[$&]')+"'";
		}

		// Execute the file search to see modlog
		require('child_process').exec(command, function(error, stdout, stderr) {
			if (error && stderr) {
				connection.popup('/modlog empty on ' + roomNames + ' or erred - modlog does not support Windows');
				console.log('/modlog error: '+error);
				return false;
			}
			if (lines) {
				if (!stdout) {
					connection.popup('The modlog is empty. (Weird.)');
				} else {
					connection.popup('Displaying the last '+lines+' lines of the Moderator Log of ' + roomNames + ':\n\n'+stdout);
				}
			} else {
				if (!stdout) {
					connection.popup('No moderator actions containing "'+target+'" were found on ' + roomNames + '.');
				} else {
					connection.popup('Displaying the last '+grepLimit+' logged actions containing "'+target+'" on ' + roomNames + ':\n\n'+stdout);
				}
			}
		});
	},

	bw: 'banword',
	banword: function(target, room, user) {
		if (!this.can('declare')) return false;
		target = toId(target);
		if (!target) {
			return this.sendReply('Specify a word or phrase to ban.');
		}
		Users.addBannedWord(target);
		this.sendReply('Added \"'+target+'\" to the list of banned words.');
	},

	ubw: 'unbanword',
	unbanword: function(target, room, user) {
		if (!this.can('declare')) return false;
		target = toId(target);
		if (!target) {
			return this.sendReply('Specify a word or phrase to unban.');
		}
		Users.removeBannedWord(target);
		this.sendReply('Removed \"'+target+'\" from the list of banned words.');
	},

	/*********************************************************
	 * Server management commands
	 *********************************************************/

	hotpatch: function(target, room, user) {
		if (!target) return this.parse('/help hotpatch');
		if (!this.can('hotpatch')) return false;

		this.logEntry(user.name + ' used /hotpatch ' + target);

		if (target === 'chat' || target === 'commands') {
			try {
				CommandParser.uncacheTree('./command-parser.js');
				CommandParser = require('./command-parser.js');

				var runningTournaments = Tournaments.tournaments;
				CommandParser.uncacheTree('./tournaments/frontend.js');
				Tournaments = require('./tournaments/frontend.js');
				Tournaments.tournaments = runningTournaments;

				return this.sendReply('Chat commands have been hot-patched.');
			} catch (e) {
				return this.sendReply('Something failed while trying to hotpatch chat: \n' + e.stack);
			}
		} else if (target === 'frost' || target === 'more') {

			try {
				CommandParser.uncacheTree('./frost-commands.js');
				frostcommands = require('./frost-commands.js');
				return this.sendReply('Frost commands have been hot-patched.');
			} catch (e) {
				return this.sendReply('Something failed while trying to hotpatch chat: \n' + e.stack);
			}
		} else if (target === 'tournaments') {
			try {
				var runningTournaments = Tournaments.tournaments;
				CommandParser.uncacheTree('./tournaments/frontend.js');
				Tournaments = require('./tournaments/frontend.js');
				Tournaments.tournaments = runningTournaments;
				return this.sendReply("Tournaments have been hot-patched.");
			} catch (e) {
				return this.sendReply('Something failed while trying to hotpatch tournaments: \n' + e.stack);
			}

		} else if (target === 'battles') {

			Simulator.SimulatorProcess.respawn();
			return this.sendReply('Battles have been hotpatched. Any battles started after now will use the new code; however, in-progress battles will continue to use the old code.');

		} else if (target === 'formats') {
			try {
				// uncache the tools.js dependency tree
				CommandParser.uncacheTree('./tools.js');
				// reload tools.js
				Tools = require('./tools.js'); // note: this will lock up the server for a few seconds
				// rebuild the formats list
				Rooms.global.formatListText = Rooms.global.getFormatListText();
				// respawn validator processes
				TeamValidator.ValidatorProcess.respawn();
				// respawn simulator processes
				Simulator.SimulatorProcess.respawn();
				// broadcast the new formats list to clients
				Rooms.global.send(Rooms.global.formatListText);

				return this.sendReply('Formats have been hotpatched.');
			} catch (e) {
				return this.sendReply('Something failed while trying to hotpatch formats: \n' + e.stack);
			}

		} else if (target === 'learnsets') {
			try {
				// uncache the tools.js dependency tree
				CommandParser.uncacheTree('./tools.js');
				// reload tools.js
				Tools = require('./tools.js'); // note: this will lock up the server for a few seconds

				return this.sendReply('Learnsets have been hotpatched.');
			} catch (e) {
				return this.sendReply('Something failed while trying to hotpatch learnsets: \n' + e.stack);
			}

		}
		this.sendReply('Your hot-patch command was unrecognized.');
	},

	savelearnsets: function(target, room, user) {
		if (!this.can('hotpatch')) return false;
		fs.writeFile('data/learnsets.js', 'exports.BattleLearnsets = '+JSON.stringify(BattleLearnsets)+";\n");
		this.sendReply('learnsets.js saved.');
	},

	disableladder: function(target, room, user) {
		if (!this.can('disableladder')) return false;
		if (LoginServer.disabled) {
			return this.sendReply('/disableladder - Ladder is already disabled.');
		}
		LoginServer.disabled = true;
		this.logModCommand('The ladder was disabled by ' + user.name + '.');
		this.add('|raw|<div class="broadcast-red"><b>Due to high server load, the ladder has been temporarily disabled</b><br />Rated games will no longer update the ladder. It will be back momentarily.</div>');
	},

	enableladder: function(target, room, user) {
		if (!this.can('disableladder')) return false;
		if (!LoginServer.disabled) {
			return this.sendReply('/enable - Ladder is already enabled.');
		}
		LoginServer.disabled = false;
		this.logModCommand('The ladder was enabled by ' + user.name + '.');
		this.add('|raw|<div class="broadcast-green"><b>The ladder is now back.</b><br />Rated games will update the ladder now.</div>');
	},

	lockdown: function(target, room, user) {
		if (!this.can('lockdown')) return false;

		Rooms.global.lockdown = true;
		for (var id in Rooms.rooms) {
			if (id !== 'global') Rooms.rooms[id].addRaw('<div class="broadcast-red"><b>The server is restarting soon.</b><br />Please finish your battles quickly. No new battles can be started until the server resets in a few minutes.</div>');
			if (Rooms.rooms[id].requestKickInactive && !Rooms.rooms[id].battle.ended) Rooms.rooms[id].requestKickInactive(user, true);
		}

		this.logEntry(user.name + ' used /lockdown');

	},

	endlockdown: function(target, room, user) {
		if (!this.can('lockdown')) return false;

		if (!Rooms.global.lockdown) {
			return this.sendReply("We're not under lockdown right now.");
		}
		Rooms.global.lockdown = false;
		for (var id in Rooms.rooms) {
			if (id !== 'global') Rooms.rooms[id].addRaw('<div class="broadcast-green"><b>The server shutdown was canceled.</b></div>');
		}

		this.logEntry(user.name + ' used /endlockdown');

	},

	
	restart: function(target, room, user) {
		if (!this.can('lockdown')) return false;
		try {
			var forever = require('forever'); 
		} catch(e) {
			return this.sendReply('/restart requires the "forever" module.');
		}

		if (!Rooms.global.lockdown) {
			return this.sendReply('For safety reasons, /restart can only be used during lockdown.');
		}

		if (CommandParser.updateServerLock) {
			return this.sendReply('Wait for /updateserver to finish before using /restart.');
		}
		this.logModCommand(user.name + ' used /restart');
		Rooms.global.send('|refresh|');
		forever.restart('app.js');
	},

	emergency: function(target, room, user) {
		if (!this.can('lockdown')) return false;

		if (config.emergency) {
			return this.sendReply("We're already in emergency mode.");
		}
		config.emergency = true;
		for (var id in Rooms.rooms) {
			if (id !== 'global') Rooms.rooms[id].addRaw('<div class="broadcast-red">The server has entered emergency mode. Some features might be disabled or limited.</div>');
		}

		this.logEntry(user.name + ' used /emergency');
	},

	endemergency: function(target, room, user) {
		if (!this.can('lockdown')) return false;

		if (!config.emergency) {
			return this.sendReply("We're not in emergency mode.");
		}
		config.emergency = false;
		for (var id in Rooms.rooms) {
			if (id !== 'global') Rooms.rooms[id].addRaw('<div class="broadcast-green"><b>The server is no longer in emergency mode.</b></div>');
		}

		this.logEntry(user.name + ' used /endemergency');
	},

	kill: function(target, room, user) {
		if (!this.can('lockdown')) return false;

		if (!Rooms.global.lockdown) {
			return this.sendReply('For safety reasons, /kill can only be used during lockdown.');
		}

		if (CommandParser.updateServerLock) {
			return this.sendReply('Wait for /updateserver to finish before using /kill.');
		}

		for (var i in Sockets.workers) {
			Sockets.workers[i].kill();
		}

		if (!room.destroyLog) {
			process.exit();
			return;
		}
		room.destroyLog(function() {
			room.logEntry(user.name + ' used /kill');
		}, function() {
			process.exit();
		});

		// Just in the case the above never terminates, kill the process
		// after 10 seconds.
		setTimeout(function() {
			process.exit();
		}, 10000);
	},

	loadbanlist: function(target, room, user, connection) {
		if (!this.can('hotpatch')) return false;

		connection.sendTo(room, 'Loading ipbans.txt...');
		fs.readFile('config/ipbans.txt', function (err, data) {
			if (err) return;
			data = (''+data).split("\n");
			var rangebans = [];
			for (var i=0; i<data.length; i++) {
				var line = data[i].split('#')[0].trim();
				if (!line) continue;
				if (line.indexOf('/') >= 0) {
					rangebans.push(line);
				} else if (line && !Users.bannedIps[line]) {
					Users.bannedIps[line] = '#ipban';
				}
			}
			Users.checkRangeBanned = Cidr.checker(rangebans);
			connection.sendTo(room, 'ibans.txt has been reloaded.');
		});
	},

	refreshpage: function(target, room, user) {
		if (!this.can('hotpatch')) return false;
		Rooms.global.send('|refresh|');
		this.logEntry(user.name + ' used /refreshpage');
	},

	updateserver: function(target, room, user, connection) {
		if (!user.hasConsoleAccess(connection)) {
			return this.sendReply('/updateserver - Access denied.');
		}

		if (CommandParser.updateServerLock) {
			return this.sendReply('/updateserver - Another update is already in progress.');
		}

		CommandParser.updateServerLock = true;

		var logQueue = [];
		logQueue.push(user.name + ' used /updateserver');

		connection.sendTo(room, 'updating...');

		var exec = require('child_process').exec;
		exec('git diff-index --quiet HEAD --', function(error) {
			var cmd = 'git pull --rebase';
			if (error) {
				if (error.code === 1) {
					// The working directory or index have local changes.
					cmd = 'git stash;' + cmd + ';git stash pop';
				} else {
					// The most likely case here is that the user does not have
					// `git` on the PATH (which would be error.code === 127).
					connection.sendTo(room, '' + error);
					logQueue.push('' + error);
					logQueue.forEach(function(line) {
						room.logEntry(line);
					});
					CommandParser.updateServerLock = false;
					return;
				}
			}
			var entry = 'Running `' + cmd + '`';
			connection.sendTo(room, entry);
			logQueue.push(entry);
			exec(cmd, function(error, stdout, stderr) {
				('' + stdout + stderr).split('\n').forEach(function(s) {
					connection.sendTo(room, s);
					logQueue.push(s);
				});
				logQueue.forEach(function(line) {
					room.logEntry(line);
				});
				CommandParser.updateServerLock = false;
			});
		});
	},

	crashfixed: function(target, room, user) {
		if (!Rooms.global.lockdown) {
			return this.sendReply('/crashfixed - There is no active crash.');
		}
		if (!this.can('hotpatch')) return false;

		Rooms.global.lockdown = false;
		if (Rooms.lobby) {
			Rooms.lobby.modchat = false;
			Rooms.lobby.addRaw('<div class="broadcast-green"><b>We fixed the crash without restarting the server!</b><br />You may resume talking in the lobby and starting new battles.</div>');
		}
		this.logEntry(user.name + ' used /crashfixed');
	},

	crashlogged: function(target, room, user) {
		if (!Rooms.global.lockdown) {
			return this.sendReply('/crashlogged - There is no active crash.');
		}
		if (!this.can('declare')) return false;

		Rooms.global.lockdown = false;
		if (Rooms.lobby) {
			Rooms.lobby.modchat = false;
			Rooms.lobby.addRaw('<div class="broadcast-green"><b>We have logged the crash and are working on fixing it!</b><br />You may resume talking in the lobby and starting new battles.</div>');
		}
		this.logEntry(user.name + ' used /crashlogged');
	},

	'memusage': 'memoryusage',
	memoryusage: function(target) {
		if (!this.can('hotpatch')) return false;
		target = toId(target) || 'all';
		if (target === 'all') {
			this.sendReply('Loading memory usage, this might take a while.');
		}
		if (target === 'all' || target === 'rooms' || target === 'room') {
			this.sendReply('Calculating Room size...');
			var roomSize = ResourceMonitor.sizeOfObject(Rooms);
			this.sendReply("Rooms are using " + roomSize + " bytes of memory.");
		}
		if (target === 'all' || target === 'config') {
			this.sendReply('Calculating config size...');
			var configSize = ResourceMonitor.sizeOfObject(config);
			this.sendReply("Config is using " + configSize + " bytes of memory.");
		}
		if (target === 'all' || target === 'resourcemonitor' || target === 'rm') {
			this.sendReply('Calculating Resource Monitor size...');
			var rmSize = ResourceMonitor.sizeOfObject(ResourceMonitor);
			this.sendReply("The Resource Monitor is using " + rmSize + " bytes of memory.");
		}
		if (target === 'all' || target === 'cmdp' || target === 'cp' || target === 'commandparser') {
			this.sendReply('Calculating Command Parser size...');
			var cpSize = ResourceMonitor.sizeOfObject(CommandParser);
			this.sendReply("Command Parser is using " + cpSize + " bytes of memory.");
		}
		if (target === 'all' || target === 'sim' || target === 'simulator') {
			this.sendReply('Calculating Simulator size...');
			var simSize = ResourceMonitor.sizeOfObject(Simulator);
			this.sendReply("Simulator is using " + simSize + " bytes of memory.");
		}
		if (target === 'all' || target === 'users') {
			this.sendReply('Calculating Users size...');
			var usersSize = ResourceMonitor.sizeOfObject(Users);
			this.sendReply("Users is using " + usersSize + " bytes of memory.");
		}
		if (target === 'all' || target === 'tools') {
			this.sendReply('Calculating Tools size...');
			var toolsSize = ResourceMonitor.sizeOfObject(Tools);
			this.sendReply("Tools are using " + toolsSize + " bytes of memory.");
		}
		if (target === 'all' || target === 'v8') {
			this.sendReply('Retrieving V8 memory usage...');
			var o = process.memoryUsage();
			this.sendReply(
				'Resident set size: ' + o.rss + ', ' + o.heapUsed +' heap used of ' + o.heapTotal  + ' total heap. '
				+ (o.heapTotal - o.heapUsed) + ' heap left.'
			);
			delete o;
		}
		if (target === 'all') {
			this.sendReply('Calculating Total size...');
			var total = (roomSize + configSize + rmSize + appSize + cpSize + simSize + toolsSize + usersSize) || 0;
			var units = ['bytes', 'K', 'M', 'G'];
			var converted = total;
			var unit = 0;
			while (converted > 1024) {
				converted /= 1024;
				unit++;
			}
			converted = Math.round(converted);
			this.sendReply("Total memory used: " + converted + units[unit] + " (" + total + " bytes).");
		}
		return;
	},

	bash: function(target, room, user, connection) {
		if (!user.hasConsoleAccess(connection)) {
			return this.sendReply('/bash - Access denied.');
		}

		var exec = require('child_process').exec;
		exec(target, function(error, stdout, stderr) {
			connection.sendTo(room, ('' + stdout + stderr));
		});
	},

	eval: function(target, room, user, connection, cmd, message) {
		if (!user.hasConsoleAccess(connection)) {
			return this.sendReply("/eval - Access denied.");
		}
		if (!this.canBroadcast()) return;

		if (!this.broadcasting) this.sendReply('||>> '+target);
		try {
			var battle = room.battle;
			var me = user;
			this.sendReply('||<< '+eval(target));
		} catch (e) {
			this.sendReply('||<< error: '+e.message);
			var stack = '||'+(''+e.stack).replace(/\n/g,'\n||');
			connection.sendTo(room, stack);
		}
	},

	evalbattle: function(target, room, user, connection, cmd, message) {
		if (!user.hasConsoleAccess(connection)) {
			return this.sendReply("/evalbattle - Access denied.");
		}
		if (!this.canBroadcast()) return;
		if (!room.battle) {
			return this.sendReply("/evalbattle - This isn't a battle room.");
		}

		room.battle.send('eval', target.replace(/\n/g, '\f'));
	},

	/*********************************************************
	 * Battle commands
	 *********************************************************/

	concede: 'forfeit',
	surrender: 'forfeit',
	forfeit: function(target, room, user) {
		if (!room.battle) {
			return this.sendReply("There's nothing to forfeit here.");
		}
		if (!room.forfeit(user)) {
			return this.sendReply("You can't forfeit this battle.");
		}
	},

	savereplay: function(target, room, user, connection) {
		if (!room || !room.battle) return;
		var logidx = 2; // spectator log (no exact HP)
		if (room.battle.ended) {
			// If the battle is finished when /savereplay is used, include
			// exact HP in the replay log.
			logidx = 3;
		}
		var data = room.getLog(logidx).join("\n");
		var datahash = crypto.createHash('md5').update(data.replace(/[^(\x20-\x7F)]+/g,'')).digest('hex');

		LoginServer.request('prepreplay', {
			id: room.id.substr(7),
			loghash: datahash,
			p1: room.p1.name,
			p2: room.p2.name,
			format: room.format
		}, function(success) {
			connection.send('|queryresponse|savereplay|'+JSON.stringify({
				log: data,
				id: room.id.substr(7)
			}));
		});
	},

	mv: 'move',
	attack: 'move',
	move: function(target, room, user) {
		if (!room.decision) return this.sendReply('You can only do this in battle rooms.');

		room.decision(user, 'choose', 'move '+target);
	},

	sw: 'switch',
	switch: function(target, room, user) {
		if (!room.decision) return this.sendReply('You can only do this in battle rooms.');

		room.decision(user, 'choose', 'switch '+parseInt(target,10));
	},

	choose: function(target, room, user) {
		if (!room.decision) return this.sendReply('You can only do this in battle rooms.');

		room.decision(user, 'choose', target);
	},

	undo: function(target, room, user) {
		if (!room.decision) return this.sendReply('You can only do this in battle rooms.');

		room.decision(user, 'undo', target);
	},

	team: function(target, room, user) {
		if (!room.decision) return this.sendReply('You can only do this in battle rooms.');

		room.decision(user, 'choose', 'team '+target);
	},

	joinbattle: function(target, room, user) {
		if (!room.joinBattle) return this.sendReply('You can only do this in battle rooms.');
		if (!user.can('joinbattle', null, room))

		room.joinBattle(user);
	},

	partbattle: 'leavebattle',
	leavebattle: function(target, room, user) {
		if (!room.leaveBattle) return this.sendReply('You can only do this in battle rooms.');

		room.leaveBattle(user);
	},

	kickbattle: function(target, room, user) {
		if (!room.leaveBattle) return this.sendReply('You can only do this in battle rooms.');

		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser || !targetUser.connected) {
			return this.sendReply('User '+this.targetUsername+' not found.');
		}
		if (!this.can('kick', targetUser)) return false;

		if (room.leaveBattle(targetUser)) {
			this.addModCommand(''+targetUser.name+' was kicked from a battle by '+user.name+'' + (target ? " (" + target + ")" : ""));
		} else {
			this.sendReply("/kickbattle - User isn\'t in battle.");
		}
	},

	kickinactive: function(target, room, user) {
		if (room.requestKickInactive) {
			room.requestKickInactive(user);
		} else {
			this.sendReply('You can only kick inactive players from inside a room.');
		}
	},

	timer: function(target, room, user) {
		target = toId(target);
		if (room.requestKickInactive) {
			if (target === 'off' || target === 'false' || target === 'stop') {
				room.stopKickInactive(user, user.can('timer'));
			} else if (target === 'on' || target === 'true' || !target) {
				room.requestKickInactive(user, user.can('timer'));
			} else {
				this.sendReply("'"+target+"' is not a recognized timer state.");
			}
		} else {
			this.sendReply('You can only set the timer from inside a room.');
		}
	},

	autotimer: 'forcetimer',
	forcetimer: function(target, room, user) {
		target = toId(target);
		if (!this.can('autotimer')) return;
		if (target === 'off' || target === 'false' || target === 'stop') {
			config.forcetimer = false;
			this.addModCommand("Forcetimer is now OFF: The timer is now opt-in. (set by "+user.name+")");
		} else if (target === 'on' || target === 'true' || !target) {
			config.forcetimer = true;
			this.addModCommand("Forcetimer is now ON: All battles will be timed. (set by "+user.name+")");
		} else {
			this.sendReply("'"+target+"' is not a recognized forcetimer setting.");
		}
	},

	forcetie: 'forcewin',
	forcewin: function(target, room, user) {
		if (!this.can('forcewin')) return false;
		if (!room.battle) {
			this.sendReply('/forcewin - This is not a battle room.');
			return false;
		}

		room.battle.endType = 'forced';
		if (!target) {
			room.battle.tie();
			this.logModCommand(user.name+' forced a tie.');
			return false;
		}
		target = Users.get(target);
		if (target) target = target.userid;
		else target = '';

		if (target) {
			room.battle.win(target);
			this.logModCommand(user.name+' forced a win for '+target+'.');
		}

	},

	/*********************************************************
	 * Challenging and searching commands
	 *********************************************************/

	cancelsearch: 'search',
	search: function(target, room, user) {
		if (target) {
			if (config.pmmodchat) {
				var userGroup = user.group;
				if (config.groupsranking.indexOf(userGroup) < config.groupsranking.indexOf(config.pmmodchat)) {
					var groupName = config.groups[config.pmmodchat].name;
					if (!groupName) groupName = config.pmmodchat;
					this.popupReply('Because moderated chat is set, you must be of rank ' + groupName +' or higher to search for a battle.');
					return false;
				}
			}
			Rooms.global.searchBattle(user, target);
		} else {
			Rooms.global.cancelSearch(user);
		}
	},

	chall: 'challenge',
	challenge: function(target, room, user, connection) {
		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser || !targetUser.connected) {
			return this.popupReply("The user '"+this.targetUsername+"' was not found.");
		}
		if (targetUser.blockChallenges && !user.can('bypassblocks', targetUser)) {
			return this.popupReply("The user '"+this.targetUsername+"' is not accepting challenges right now.");
		}
		if (config.pmmodchat) {
			var userGroup = user.group;
			if (config.groupsranking.indexOf(userGroup) < config.groupsranking.indexOf(config.pmmodchat)) {
				var groupName = config.groups[config.pmmodchat].name;
				if (!groupName) groupName = config.pmmodchat;
				this.popupReply('Because moderated chat is set, you must be of rank ' + groupName +' or higher to challenge users.');
				return false;
			}
		}
		user.prepBattle(target, 'challenge', connection, function (result) {
			if (result) user.makeChallenge(targetUser, target);
		});
	},

	idle: 'blockchallenges',
	blockchallenges: function(target, room, user) {
		user.blockChallenges = true;
		this.sendReply('You are now blocking all incoming challenge requests.');
	},

	allowchallenges: function(target, room, user) {
		user.blockChallenges = false;
		this.sendReply('You are available for challenges from now on.');
	},

	cchall: 'cancelChallenge',
	cancelchallenge: function(target, room, user) {
		user.cancelChallengeTo(target);
	},

	accept: function(target, room, user, connection) {
		var userid = toUserid(target);
		var format = '';
		if (user.challengesFrom[userid]) format = user.challengesFrom[userid].format;
		if (!format) {
			this.popupReply(target+" cancelled their challenge before you could accept it.");
			return false;
		}
		user.prepBattle(format, 'challenge', connection, function (result) {
			if (result) user.acceptChallengeFrom(userid);
		});
	},

	reject: function(target, room, user) {
		user.rejectChallengeFrom(toUserid(target));
	},

	saveteam: 'useteam',
	utm: 'useteam',
	useteam: function(target, room, user) {
		user.team = target;
	},

	/*********************************************************
	 * Low-level
	 *********************************************************/

	cmd: 'query',
	query: function(target, room, user, connection) {
		// Avoid guest users to use the cmd errors to ease the app-layer attacks in emergency mode
		var trustable = (!config.emergency || (user.named && user.authenticated));
		if (config.emergency && ResourceMonitor.countCmd(connection.ip, user.name)) return false;
		var spaceIndex = target.indexOf(' ');
		var cmd = target;
		if (spaceIndex > 0) {
			cmd = target.substr(0, spaceIndex);
			target = target.substr(spaceIndex+1);
		} else {
			target = '';
		}
		if (cmd === 'userdetails') {

			var targetUser = Users.get(target);
			if (!trustable || !targetUser) {
				connection.send('|queryresponse|userdetails|'+JSON.stringify({
					userid: toId(target),
					rooms: false
				}));
				return false;
			}
			var roomList = {};
			for (var i in targetUser.roomCount) {
				if (i==='global') continue;
				var targetRoom = Rooms.get(i);
				if (!targetRoom || targetRoom.isPrivate) continue;
				var roomData = {};
				if (targetRoom.battle) {
					var battle = targetRoom.battle;
					roomData.p1 = battle.p1?' '+battle.p1:'';
					roomData.p2 = battle.p2?' '+battle.p2:'';
				}
				roomList[i] = roomData;
			}
			if (!targetUser.roomCount['global']) roomList = false;
			var userdetails = {
				userid: targetUser.userid,
				avatar: targetUser.avatar,
				rooms: roomList
			};
			if (user.can('ip', targetUser)) {
				var ips = Object.keys(targetUser.ips);
				if (ips.length === 1) {
					userdetails.ip = ips[0];
				} else {
					userdetails.ips = ips;
				}
			}
			connection.send('|queryresponse|userdetails|'+JSON.stringify(userdetails));

		} else if (cmd === 'roomlist') {
			if (!trustable) return false;
			connection.send('|queryresponse|roomlist|'+JSON.stringify({
				rooms: Rooms.global.getRoomList(true)
			}));

		} else if (cmd === 'rooms') {
			if (!trustable) return false;
			connection.send('|queryresponse|rooms|'+JSON.stringify(
				Rooms.global.getRooms()
			));

		}
	},

	trn: function(target, room, user, connection) {
		var commaIndex = target.indexOf(',');
		var targetName = target;
		var targetAuth = false;
		var targetToken = '';
		if (commaIndex >= 0) {
			targetName = target.substr(0,commaIndex);
			target = target.substr(commaIndex+1);
			commaIndex = target.indexOf(',');
			targetAuth = target;
			if (commaIndex >= 0) {
				targetAuth = !!parseInt(target.substr(0,commaIndex),10);
				targetToken = target.substr(commaIndex+1);
			}
		}
		user.rename(targetName, targetToken, targetAuth, connection);
	},

};
