const { 
    Client, GatewayIntentBits, Partials, EmbedBuilder, AttachmentBuilder, 
    REST, Routes, SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, 
    ButtonStyle, ChannelType, PermissionFlagsBits 
} = require('discord.js');

// Khởi tạo Client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.DirectMessages
    ],
    partials: [Partials.Channel]
});

// ID của Admin (Chủ Bot)
const ADMIN_ID = process.env.ADMIN_ID || '1475874397175939225';


// ================= 1. ĐĂNG KÝ TẤT CẢ LỆNH SLASH =================
client.on('ready', async () => {
    console.log(`Bot đã sẵn sàng! Đăng nhập với tên: ${client.user.tag}`);

    const commands = [
        // --- CÁC LỆNH DÙNG ĐƯỢC Ở MỌI NƠI (USER APP) ---
        new SlashCommandBuilder()
            .setName('qr')
            .setDescription('Gửi ảnh QR thanh toán của Admin')
            .setIntegrationTypes([0, 1]).setContexts([0, 1, 2]),
            
        new SlashCommandBuilder()
            .setName('avt')
            .setDescription('Xem avatar của người dùng')
            .addUserOption(option => option.setName('target').setDescription('Người bạn muốn xem avatar').setRequired(false))
            .setIntegrationTypes([0, 1]).setContexts([0, 1, 2]),

        new SlashCommandBuilder()
            .setName('translate')
            .setDescription('Dịch văn bản sang ngôn ngữ khác')
            .addStringOption(option => option.setName('lang').setDescription('Mã ngôn ngữ đích (VD: vi, en, ja, ko, zh)').setRequired(true))
            .addStringOption(option => option.setName('text').setDescription('Văn bản cần dịch').setRequired(true))
            .setIntegrationTypes([0, 1]).setContexts([0, 1, 2]),

        new SlashCommandBuilder()
            .setName('geticon')
            .setDescription('Lấy ảnh chất lượng cao của một emoji/icon')
            .addStringOption(option => option.setName('emoji').setDescription('Nhập/Dán emoji cần lấy hình').setRequired(true))
            .setIntegrationTypes([0, 1]).setContexts([0, 1, 2]),

        new SlashCommandBuilder()
            .setName('ping')
            .setDescription('Kiểm tra độ trễ (ping/latency) của Bot')
            .setIntegrationTypes([0, 1]).setContexts([0, 1, 2]),

        new SlashCommandBuilder()
            .setName('userinfo')
            .setDescription('Xem thông tin chi tiết của một người dùng')
            .addUserOption(option => option.setName('target').setDescription('Người dùng cần xem').setRequired(false))
            .setIntegrationTypes([0, 1]).setContexts([0, 1, 2]),

        new SlashCommandBuilder()
            .setName('shorturl')
            .setDescription('Rút gọn một liên kết dài')
            .addStringOption(option => option.setName('link').setDescription('Dán liên kết cần rút gọn').setRequired(true))
            .setIntegrationTypes([0, 1]).setContexts([0, 1, 2]),



        // --- CÁC LỆNH CHỈ DÙNG TRONG SERVER (QUẢN TRỊ) ---
        new SlashCommandBuilder()
            .setName('ticketsetup')
            .setDescription('Tạo bảng nút bấm Ticket hỗ trợ mua hàng')
            .setIntegrationTypes([0]).setContexts([0]),

        new SlashCommandBuilder()
            .setName('clear')
            .setDescription('Xóa số lượng tin nhắn chỉ định')
            .addIntegerOption(option => option.setName('amount').setDescription('Số lượng (1-100)').setRequired(true).setMinValue(1).setMaxValue(100))
            .setIntegrationTypes([0]).setContexts([0]),

        new SlashCommandBuilder()
            .setName('nuke')
            .setDescription('Xóa toàn bộ tin nhắn trong kênh (Xóa kênh và tạo lại)')
            .setIntegrationTypes([0]).setContexts([0]),

        new SlashCommandBuilder()
            .setName('clean')
            .setDescription('Tạo một kênh mới giống y hệt kênh hiện tại')
            .setIntegrationTypes([0]).setContexts([0]),

        new SlashCommandBuilder()
            .setName('lock')
            .setDescription('Khóa kênh, không cho @everyone nhắn tin')
            .setIntegrationTypes([0]).setContexts([0]),

        new SlashCommandBuilder()
            .setName('serverstatus')
            .setDescription('Xem thông tin server')
            .setIntegrationTypes([0]).setContexts([0]),

        new SlashCommandBuilder()
            .setName('mute')
            .setDescription('Mute người dùng theo thời gian')
            .addUserOption(option => option.setName('target').setDescription('Người cần mute').setRequired(true))
            .addStringOption(option => option.setName('time').setDescription('Thời gian (VD: 1s, 1m, 1h, 1d)').setRequired(true))
            .setIntegrationTypes([0]).setContexts([0]),

        new SlashCommandBuilder()
            .setName('unmute')
            .setDescription('Bỏ mute người dùng')
            .addUserOption(option => option.setName('target').setDescription('Người cần bỏ mute').setRequired(true))
            .setIntegrationTypes([0]).setContexts([0]),

        new SlashCommandBuilder()
            .setName('kick')
            .setDescription('Đuổi người dùng khỏi server')
            .addUserOption(option => option.setName('target').setDescription('Người cần kick').setRequired(true))
            .setIntegrationTypes([0]).setContexts([0]),

        new SlashCommandBuilder()
            .setName('ban')
            .setDescription('Ban người dùng và xóa tin nhắn (7 ngày)')
            .addUserOption(option => option.setName('target').setDescription('Người cần ban').setRequired(true))
            .setIntegrationTypes([0]).setContexts([0]),

        new SlashCommandBuilder()
            .setName('unban')
            .setDescription('Bỏ ban người dùng')
            .addStringOption(option => option.setName('userid').setDescription('ID của người cần unban').setRequired(true))
            .setIntegrationTypes([0]).setContexts([0]),

        new SlashCommandBuilder()
            .setName('embed')
            .setDescription('Gửi một tin nhắn dạng Embed (Chỉ Admin)')
            .addStringOption(option => option.setName('title').setDescription('Tiêu đề của Embed').setRequired(true))
            .addStringOption(option => option.setName('description').setDescription('Nội dung của Embed (Dùng \\n để xuống dòng)').setRequired(true))
            .addStringOption(option => option.setName('server').setDescription('Chọn Server muốn gửi (Chỉ cần nếu gửi từ ngoài Server)').setAutocomplete(true).setRequired(false))
            .addStringOption(option => option.setName('channel_id').setDescription('Chọn Kênh muốn gửi (Chỉ cần nếu gửi từ ngoài Server)').setAutocomplete(true).setRequired(false))
            .addStringOption(option => option.setName('color').setDescription('Màu viền dạng Hex (mặc định màu hồng pastel)').setRequired(false))
            .addBooleanOption(option => option.setName('thumbnail').setDescription('Hiện ảnh server nhỏ ở góc phải (Mặc định: Bật)').setRequired(false))
            .setIntegrationTypes([0, 1]).setContexts([0, 1, 2])
    ];

    const rest = new REST({ version: '10' }).setToken(client.token);

    try {
        console.log('Đang đăng ký các lệnh Slash...');
        await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: commands.map(c => c.toJSON()) }
        );
        console.log('Đã đăng ký toàn bộ lệnh Slash thành công!');
    } catch (error) {
        console.error('Lỗi khi đăng ký lệnh Slash:', error);
    }
});

// ================= 2. XỬ LÝ TƯƠNG TÁC (LỆNH SLASH & NÚT BẤM) =================
client.on('interactionCreate', async (interaction) => {
    
    // ---------------- XỬ LÝ AUTOCOMPLETE ----------------
    if (interaction.isAutocomplete()) {
        if (interaction.commandName === 'embed') {
            const focusedOption = interaction.options.getFocused(true);
            
            if (focusedOption.name === 'server') {
                // Lọc danh sách Guilds mà bot tham gia
                const guilds = client.guilds.cache.map(g => ({ name: g.name, value: g.id }));
                const filtered = guilds.filter(g => g.name.toLowerCase().includes(focusedOption.value.toLowerCase())).slice(0, 25);
                await interaction.respond(filtered).catch(console.error);
            } 
            else if (focusedOption.name === 'channel_id') {
                const serverId = interaction.options.getString('server');
                if (serverId) {
                    const guild = client.guilds.cache.get(serverId);
                    if (guild) {
                        // Lọc các kênh Chat text trong server đó
                        const channels = guild.channels.cache
                            .filter(c => c.type === ChannelType.GuildText)
                            .map(c => ({ name: `#${c.name}`, value: c.id }));
                        const filtered = channels.filter(c => c.name.toLowerCase().includes(focusedOption.value.toLowerCase())).slice(0, 25);
                        await interaction.respond(filtered).catch(console.error);
                    } else {
                        await interaction.respond([]).catch(console.error);
                    }
                } else {
                    // Nếu chưa chọn server, có thể lọc từ server hiện tại (nếu đang ở trong server)
                    if (interaction.guild) {
                        const channels = interaction.guild.channels.cache
                            .filter(c => c.type === ChannelType.GuildText)
                            .map(c => ({ name: `#${c.name}`, value: c.id }));
                        const filtered = channels.filter(c => c.name.toLowerCase().includes(focusedOption.value.toLowerCase())).slice(0, 25);
                        await interaction.respond(filtered).catch(console.error);
                    } else {
                        await interaction.respond([]).catch(console.error);
                    }
                }
            }
        }
        return;
    }
    
    // ---------------- XỬ LÝ NÚT BẤM (TICKET) ----------------
    if (interaction.isButton()) {
        
        // NÚT TẠO TICKET
        if (interaction.customId === 'create_ticket') {
            await interaction.reply({ content: 'Đang tạo kênh hỗ trợ cho bạn...', ephemeral: true });

            try {
                // 1. Tìm số thứ tự Ticket tiếp theo (00000, 00001...)
                const ticketChannels = interaction.guild.channels.cache.filter(c => c.name.startsWith('ticket-'));
                let nextNum = 0;
                if (ticketChannels.size > 0) {
                    const nums = ticketChannels.map(c => {
                        const match = c.name.match(/\d+/);
                        return match ? parseInt(match[0]) : 0;
                    });
                    nextNum = Math.max(...nums) + 1;
                }
                // Format số thành 5 chữ số (VD: 00001)
                const ticketName = `ticket-${nextNum.toString().padStart(5, '0')}`;

                // 2. Tạo kênh riêng tư
                const ticketChannel = await interaction.guild.channels.create({
                    name: ticketName,
                    type: ChannelType.GuildText,
                    permissionOverwrites: [
                        {
                            id: interaction.guild.id, // @everyone
                            deny: [PermissionFlagsBits.ViewChannel], // Ẩn với tất cả mọi người
                        },
                        {
                            id: interaction.user.id, // Người bấm nút
                            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory],
                        },
                        {
                            id: ADMIN_ID, // ID của Chủ Bot (Founder)
                            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory],
                        }
                    ],
                });

                await interaction.editReply({ content: `Kênh hỗ trợ của bạn đã được tạo tại: ${ticketChannel}` });

                // 3. Gửi lời chào vào kênh Ticket
                const welcomeEmbed = new EmbedBuilder()
                    .setColor('#00ff88')
                    .setTitle(`Hỗ trợ khách hàng | ${ticketName}`)
                    .setDescription(`Cảm ơn bạn đã quan tâm đến dịch vụ của chúng mình!\n\nVui lòng để lại yêu cầu hoặc câu hỏi của bạn ở đây. Quản trị viên sẽ vào hỗ trợ bạn trong thời gian sớm nhất.`);
                
                const closeBtn = new ButtonBuilder()
                    .setCustomId('close_ticket')
                    .setLabel('🔒 Đóng Ticket (Chỉ Admin)')
                    .setStyle(ButtonStyle.Danger);
                
                const row = new ActionRowBuilder().addComponents(closeBtn);

                await ticketChannel.send({
                    content: `Xin chào <@${interaction.user.id}>,`,
                    embeds: [welcomeEmbed],
                    components: [row]
                });

            } catch (error) {
                console.error(error);
                await interaction.editReply({ content: 'Đã xảy ra lỗi khi tạo ticket. Vui lòng kiểm tra lại quyền của bot.' });
            }
        }

        // NÚT ĐÓNG TICKET
        if (interaction.customId === 'close_ticket') {
            // Kiểm tra quyền: Chỉ Chủ Bot HOẶC người có quyền Quản lý Server mới được đóng
            const isBotOwner = interaction.user.id === ADMIN_ID;
            const isServerManager = interaction.member.permissions.has(PermissionFlagsBits.ManageChannels) || interaction.member.permissions.has(PermissionFlagsBits.Administrator);

            if (!isBotOwner && !isServerManager) {
                return interaction.reply({ content: '❌ Chỉ có Quản trị viên mới có quyền đóng Ticket này!', ephemeral: true });
            }

            await interaction.reply('Kênh này sẽ bị xóa sau 3 giây...');
            setTimeout(() => interaction.channel.delete().catch(() => {}), 3000);
        }
        return; // Kết thúc xử lý nút bấm
    }

    // ---------------- XỬ LÝ LỆNH SLASH ----------------
    if (!interaction.isChatInputCommand()) return;

    const { commandName, options } = interaction;

    // DANH SÁCH LỆNH CÔNG KHAI (MỌI NGƯỜI ĐỀU DÙNG ĐƯỢC)
    const publicCommands = ['qr', 'avt', 'translate', 'geticon', 'ping', 'userinfo', 'shorturl'];

    // KIỂM TRA QUYỀN ADMIN CHO CÁC LỆNH CÒN LẠI
    if (!publicCommands.includes(commandName) && interaction.user.id !== ADMIN_ID) {
        return interaction.reply({ content: 'Bạn không có quyền sử dụng lệnh này!', ephemeral: true });
    }


    try {
        // Lệnh Ticket Setup
        if (commandName === 'ticketsetup') {
            const embed = new EmbedBuilder()
                .setColor('#2b2d31')
                .setTitle('🎧 TRUNG TÂM HỖ TRỢ KHÁCH HÀNG')
                .setDescription('🎯 **Bạn có thể mở Ticket để yêu cầu:**\n\n> 🛒 Tư vấn & Đăng ký mua sản phẩm\n> ⚠️ Báo cáo lỗi hoặc sự cố kỹ thuật\n> 🛠️ Yêu cầu hỗ trợ trong quá trình sử dụng\n> ⚖️ Phản ánh, khiếu nại về chất lượng dịch vụ\n> ❓ Giải đáp các thắc mắc khác\n\n👉 **Nhấn vào nút bên dưới để kết nối trực tiếp với đội ngũ Admin nhé 📩**')
                .setFooter({ text: 'Hệ thống hỗ trợ tự động', iconURL: interaction.guild.iconURL() });
            
            const btn = new ButtonBuilder()
                .setCustomId('create_ticket')
                .setLabel('📩 Tạo Ticket Hỗ Trợ')
                .setStyle(ButtonStyle.Primary);
            
            const row = new ActionRowBuilder().addComponents(btn);

            await interaction.reply({ embeds: [embed], components: [row] });
        }

        // Lệnh Translate
        else if (commandName === 'translate') {
            await interaction.deferReply();
            const lang = options.getString('lang');
            const text = options.getString('text');
            
            try {
                const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${encodeURIComponent(text)}`;
                const response = await fetch(url);
                const json = await response.json();
                
                const translatedText = json[0].map(item => item[0]).join('');
                
                const transEmbed = new EmbedBuilder()
                    .setColor('Random')
                    .setTitle('Google Dịch')
                    .addFields(
                        { name: 'Văn bản gốc', value: text },
                        { name: `Dịch sang (${lang})`, value: translatedText }
                    );
                await interaction.editReply({ embeds: [transEmbed] });
            } catch (err) {
                await interaction.editReply({ content: 'Đã xảy ra lỗi khi dịch văn bản. Vui lòng thử lại sau.' });
            }
        }

        // Lệnh QR
        else if (commandName === 'qr') {
            await interaction.deferReply();
            const qrImage = new AttachmentBuilder('./qr.jpg');
            await interaction.editReply({ content: 'Đây là mã QR của Admin:', files: [qrImage] });
        }

        // Lệnh Avatar
        else if (commandName === 'avt') {
            const target = options.getUser('target') || interaction.user;
            const avatarEmbed = new EmbedBuilder()
                .setColor('Random')
                .setTitle(`Avatar của ${target.tag}`)
                .setImage(target.displayAvatarURL({ size: 1024, dynamic: true }));
            await interaction.reply({ embeds: [avatarEmbed] });
        }

        // Lệnh Get Icon
        else if (commandName === 'geticon') {
            const emojiInput = options.getString('emoji').trim();
            
            // Regex match emoji custom: <:name:id> hoặc <a:name:id>
            const customEmojiRegex = /<(a)?:([^:]+):(\d+)>/;
            const match = emojiInput.match(customEmojiRegex);
            
            if (match) {
                const isAnimated = !!match[1];
                const emojiName = match[2];
                const emojiId = match[3];
                const extension = isAnimated ? 'gif' : 'png';
                const emojiUrl = `https://cdn.discordapp.com/emojis/${emojiId}.${extension}?size=1024`;
                
                const embed = new EmbedBuilder()
                    .setColor('#00ff88')
                    .setTitle(`Emoji: :${emojiName}:`)
                    .setDescription(`[Nhấn vào đây để tải về](${emojiUrl})`)
                    .setImage(emojiUrl)
                    .setFooter({ text: `ID: ${emojiId} | Định dạng: ${extension.toUpperCase()}` });
                
                await interaction.reply({ embeds: [embed] });
            } else {
                // Nhận dạng emoji mặc định (Unicode)
                const codePoints = Array.from(emojiInput).map(char => char.codePointAt(0).toString(16)).join('-');
                
                if (codePoints && !codePoints.includes(' ')) {
                    const twemojiUrl = `https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/${codePoints}.png`;
                    
                    const embed = new EmbedBuilder()
                        .setColor('#ffaa00')
                        .setTitle(`Emoji mặc định (Unicode)`)
                        .setDescription(`[Nhấn vào đây để tải về](${twemojiUrl})`)
                        .setImage(twemojiUrl)
                        .setFooter({ text: `Code points: ${codePoints}` });
                    
                    await interaction.reply({ embeds: [embed] }).catch(async () => {
                        await interaction.reply({ content: '❌ Không tìm thấy ảnh cho emoji này. Hãy thử nhập emoji tùy chỉnh (custom emoji) của Server.', ephemeral: true });
                    });
                } else {
                    await interaction.reply({ content: '❌ Vui lòng nhập đúng 1 emoji hợp lệ.', ephemeral: true });
                }
            }
        }

        // Lệnh Ping
        else if (commandName === 'ping') {
            const sent = await interaction.reply({ content: 'Đang đo độ trễ...', fetchReply: true });
            const latency = sent.createdTimestamp - interaction.createdTimestamp;
            const apiPing = client.ws.ping;
            
            const pingEmbed = new EmbedBuilder()
                .setColor('#00ff88')
                .setTitle('⚡ ĐỘ TRỄ HỆ THỐNG')
                .addFields(
                    { name: '📶 Phản hồi của Bot', value: `${latency}ms`, inline: true },
                    { name: '🤖 Kết nối Discord API', value: `${apiPing}ms`, inline: true }
                )
                .setTimestamp();
            await interaction.editReply({ content: null, embeds: [pingEmbed] });
        }

        // Lệnh UserInfo
        else if (commandName === 'userinfo') {
            const targetUser = options.getUser('target') || interaction.user;
            let targetMember = null;
            if (interaction.guild) {
                targetMember = await interaction.guild.members.fetch(targetUser.id).catch(() => null);
            }
            
            const creationDate = `<t:${Math.floor(targetUser.createdTimestamp / 1000)}:F> (<t:${Math.floor(targetUser.createdTimestamp / 1000)}:R>)`;
            const joinDate = targetMember ? `<t:${Math.floor(targetMember.joinedTimestamp / 1000)}:F> (<t:${Math.floor(targetMember.joinedTimestamp / 1000)}:R>)` : 'Không thuộc server này';
            const roles = targetMember ? targetMember.roles.cache.filter(r => r.id !== interaction.guild.id).map(r => r.toString()).join(', ') || 'Không có' : 'N/A';
            
            const embed = new EmbedBuilder()
                .setColor('Random')
                .setTitle(`Thông tin thành viên: ${targetUser.tag}`)
                .setThumbnail(targetUser.displayAvatarURL({ dynamic: true }))
                .addFields(
                    { name: '🆔 ID Người Dùng', value: targetUser.id, inline: true },
                    { name: '🤖 Loại Tài Khoản', value: targetUser.bot ? 'Tài khoản Bot' : 'Người dùng thường', inline: true },
                    { name: '📅 Ngày Tạo Tài Khoản', value: creationDate },
                    { name: '📥 Ngày Tham Gia Server', value: joinDate }
                );
                
            if (interaction.guild && targetMember) {
                embed.addFields({ name: '🎭 Vai trò (Roles)', value: roles });
            }
            
            await interaction.reply({ embeds: [embed] });
        }

        // Lệnh Short URL
        else if (commandName === 'shorturl') {
            await interaction.deferReply();
            const longUrl = options.getString('link');
            
            if (!/^https?:\/\/.+/i.test(longUrl)) {
                return interaction.editReply({ content: '❌ Định dạng liên kết không hợp lệ. Vui lòng nhập link bắt đầu bằng `http://` hoặc `https://`.' });
            }
            
            const https = require('https');
            const apiUrl = `https://tinyurl.com/api-create.php?url=${encodeURIComponent(longUrl)}`;
            
            https.get(apiUrl, (res) => {
                let data = '';
                res.on('data', (chunk) => { data += chunk; });
                res.on('end', async () => {
                    if (res.statusCode === 200 && data.startsWith('http')) {
                        const embed = new EmbedBuilder()
                            .setColor('#00ff88')
                            .setTitle('🔗 Rút Gọn Liên Kết Thành Công')
                            .addFields(
                                { name: 'Liên kết gốc', value: longUrl },
                                { name: 'Liên kết rút gọn', value: data }
                            )
                            .setTimestamp();
                        await interaction.editReply({ embeds: [embed] });
                    } else {
                        await interaction.editReply({ content: '❌ Lỗi từ dịch vụ rút gọn liên kết. Vui lòng thử lại sau.' });
                    }
                });
            }).on('error', async (err) => {
                console.error(err);
                await interaction.editReply({ content: '❌ Không thể kết nối tới máy chủ rút gọn liên kết.' });
            });
        }

        // Lệnh Embed (Chỉ dành cho Admin)
        else if (commandName === 'embed') {
            const title = options.getString('title');
            const description = options.getString('description').replace(/\\n/g, '\n');
            const colorInput = options.getString('color') || '#ffb7d2'; // Mặc định màu hồng pastel
            const showThumbnail = options.getBoolean('thumbnail') !== false; // Mặc định: Bật (true)
            
            const serverId = options.getString('server');
            const channelId = options.getString('channel_id');
            
            let targetGuild = interaction.guild;
            let targetChannel = interaction.channel;
            
            if (serverId) {
                targetGuild = client.guilds.cache.get(serverId);
                if (!targetGuild) {
                    return interaction.reply({ content: '❌ Không tìm thấy Server đã chọn hoặc Bot không có trong Server đó.', ephemeral: true });
                }
            }
            
            if (channelId) {
                if (targetGuild) {
                    targetChannel = targetGuild.channels.cache.get(channelId);
                } else {
                    targetChannel = client.channels.cache.get(channelId);
                }
                if (!targetChannel) {
                    return interaction.reply({ content: '❌ Không tìm thấy Kênh đã chọn.', ephemeral: true });
                }
            }
            
            // Nếu không xác định được guild/kênh (ví dụ đang ở DM và không điền option)
            if (!targetGuild || !targetChannel) {
                return interaction.reply({ content: '❌ Bạn đang ở ngoài Server. Vui lòng chọn Server và Kênh muốn gửi thông báo.', ephemeral: true });
            }
            
            // Định dạng màu hex chuẩn
            let color = colorInput;
            if (!color.startsWith('#')) color = '#' + color;
            if (!/^#[0-9A-F]{6}$/i.test(color)) {
                color = '#ffb7d2';
            }
            
            // Bố cục mô tả dễ đọc hơn và tag Admin
            let formattedDescription = `\n${description}\n\n`;
            formattedDescription += `━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
            formattedDescription += `👑 **Quản trị viên:** <@${ADMIN_ID}>\n`;
            formattedDescription += `💬 *Hãy liên hệ Admin nếu bạn cần hỗ trợ thêm!*`;
            
            const embed = new EmbedBuilder()
                .setColor(color)
                .setTitle(`✨ ${title}`)
                .setDescription(formattedDescription)
                .setAuthor({ 
                    name: targetGuild.name, 
                    iconURL: targetGuild.iconURL({ dynamic: true }) || client.user.displayAvatarURL()
                })
                .setFooter({ 
                    text: `Thông báo Hệ Thống • Đăng bởi ${interaction.user.username}`, 
                    iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                })
                .setTimestamp();

            const files = [];
            if (showThumbnail) {
                const fs = require('fs');
                if (fs.existsSync('./logo_chu_p.png')) {
                    const logoAttachment = new AttachmentBuilder('./logo_chu_p.png', { name: 'logo_chu_p.png' });
                    embed.setThumbnail('attachment://logo_chu_p.png');
                    files.push(logoAttachment);
                } else if (targetGuild.iconURL()) {
                    embed.setThumbnail(targetGuild.iconURL({ dynamic: true }));
                }
            }
                
            try {
                await targetChannel.send({ embeds: [embed], files: files });
                await interaction.reply({ content: `✅ Đã gửi tin nhắn Embed đến kênh ${targetChannel} của Server **${targetGuild.name}** thành công!`, ephemeral: true });
            } catch (err) {
                console.error(err);
                await interaction.reply({ content: `❌ Thất bại! Đảm bảo Bot có quyền gửi tin nhắn và xem kênh trong Server đó.`, ephemeral: true });
            }
        }


        // Các lệnh quản trị cũ...
        else if (commandName === 'clear') {
            const amount = options.getInteger('amount');
            await interaction.channel.bulkDelete(amount, true);
            await interaction.reply({ content: `Đã xóa ${amount} tin nhắn.`, ephemeral: true });
        }

        else if (commandName === 'nuke') {
            await interaction.reply({ content: 'Đang nuke kênh này...', ephemeral: true });
            const channel = interaction.channel;
            const clonedChannel = await channel.clone();
            await clonedChannel.setPosition(channel.position);
            await channel.delete();
            clonedChannel.send('Kênh đã được nuke thành công! 💥');
        }

        else if (commandName === 'clean') {
            await interaction.channel.clone();
            await interaction.reply({ content: 'Đã tạo một kênh mới giống y hệt kênh này.', ephemeral: true });
        }

        else if (commandName === 'lock') {
            await interaction.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { SendMessages: false });
            await interaction.reply({ content: 'Kênh này đã bị khóa. @everyone không thể gửi tin nhắn nữa 🔒' });
        }

        else if (commandName === 'serverstatus') {
            const guild = interaction.guild;
            const totalMembers = guild.memberCount;
            const bots = guild.members.cache.filter(m => m.user.bot).size;
            const humans = totalMembers - bots;

            const statusEmbed = new EmbedBuilder()
                .setColor('Green')
                .setTitle(`Thông tin server: ${guild.name}`)
                .addFields(
                    { name: 'Tổng số thành viên', value: `${totalMembers}`, inline: true },
                    { name: 'Người', value: `${humans}`, inline: true },
                    { name: 'Bot', value: `${bots}`, inline: true }
                );
            await interaction.reply({ embeds: [statusEmbed] });
        }

        else if (commandName === 'mute') {
            const targetUser = options.getUser('target');
            const targetMember = await interaction.guild.members.fetch(targetUser.id);
            const timeString = options.getString('time');

            let ms = 0;
            if (timeString.endsWith('s')) ms = parseInt(timeString) * 1000;
            else if (timeString.endsWith('m')) ms = parseInt(timeString) * 60000;
            else if (timeString.endsWith('h')) ms = parseInt(timeString) * 3600000;
            else if (timeString.endsWith('d')) ms = parseInt(timeString) * 86400000;

            if (ms === 0 || isNaN(ms)) return interaction.reply({ content: 'Định dạng thời gian không hợp lệ.', ephemeral: true });

            await targetMember.timeout(ms, 'Bị mute bởi Admin');
            await interaction.reply({ content: `Đã mute ${targetUser.tag} trong ${timeString}.` });
        }

        else if (commandName === 'unmute') {
            const targetUser = options.getUser('target');
            const targetMember = await interaction.guild.members.fetch(targetUser.id);
            await targetMember.timeout(null);
            await interaction.reply({ content: `Đã bỏ mute cho ${targetUser.tag}.` });
        }

        else if (commandName === 'kick') {
            const targetUser = options.getUser('target');
            const targetMember = await interaction.guild.members.fetch(targetUser.id);
            await targetMember.kick('Bị kick bởi Admin');
            await interaction.reply({ content: `Đã kick ${targetUser.tag}.` });
        }

        else if (commandName === 'ban') {
            const targetUser = options.getUser('target');
            await interaction.guild.members.ban(targetUser.id, { deleteMessageSeconds: 604800, reason: 'Bị ban bởi Admin' });
            await interaction.reply({ content: `Đã ban ${targetUser.tag} và xóa tin nhắn của họ trong 7 ngày qua.` });
        }

        else if (commandName === 'unban') {
            const userId = options.getString('userid');
            await interaction.guild.bans.remove(userId);
            await interaction.reply({ content: `Đã unban người dùng có ID: ${userId}.` });
        }

    } catch (error) {
        console.error(error);
        const errorMsg = 'Đã xảy ra lỗi khi thực hiện lệnh này. (Có thể bot không đủ quyền, hoặc role của bot thấp hơn người bị xử lý).';
        if (interaction.deferred || interaction.replied) {
            await interaction.editReply({ content: errorMsg }).catch(() => {});
        } else {
            await interaction.reply({ content: errorMsg, ephemeral: true }).catch(() => {});
        }
    }
});

// ================= 3. XỬ LÝ LỆNH TIN NHẮN (CHỈ CÒN 1HELP) =================
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (message.author.id !== ADMIN_ID) return;

    if (message.content.trim().toLowerCase() === '1help') {
        const helpEmbed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Danh sách lệnh của Bot (Chỉ Admin)')
            .setDescription('Tất cả các lệnh quản trị giờ đây đã được chuyển thành lệnh Slash (`/`). Hãy gõ `/` để xem danh sách lệnh.')
            .addFields(
                { name: '1help', value: 'Hiện danh sách lệnh này' },
                { name: '/ticketsetup', value: 'Tạo bảng nút bấm hỗ trợ mua hàng' },
                { name: '/translate', value: 'Dịch văn bản (Dùng được ở mọi nơi)' },
                { name: '/qr', value: 'Gửi ảnh QR thanh toán (Dùng được ở mọi nơi)' },
                { name: '/avt', value: 'Xem avatar (Dùng được ở mọi nơi)' },
                { name: '/geticon', value: 'Lấy ảnh emoji/icon chất lượng cao (Dùng được ở mọi nơi)' },
                { name: '/ping', value: 'Kiểm tra độ trễ của Bot (Mọi nơi)' },
                { name: '/userinfo', value: 'Xem thông tin chi tiết một người dùng (Mọi nơi)' },
                { name: '/shorturl', value: 'Rút gọn một liên kết dài (Mọi nơi)' },
                { name: '/embed', value: 'Gửi tin nhắn khung Embed (Chỉ Admin)' },
                { name: '/clear', value: 'Xóa tin nhắn' },
                { name: '/nuke', value: 'Xóa và tạo lại kênh' },
                { name: '/clean', value: 'Tạo kênh mới giống kênh hiện tại' },
                { name: '/lock', value: 'Khóa kênh' },
                { name: '/serverstatus', value: 'Xem thông tin server' },
                { name: '/mute', value: 'Mute người dùng' },
                { name: '/unmute', value: 'Bỏ mute' },
                { name: '/kick', value: 'Kick người dùng' },
                { name: '/ban', value: 'Ban người dùng' },
                { name: '/unban', value: 'Unban người dùng' }
            );
        return message.reply({ embeds: [helpEmbed] });
    }
});

// ================= 4. KHỞI TẠO WEB SERVER (Để treo trên Render Free Web Service) =================
const http = require('http');
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Bot Discord đang hoạt động 24/7!');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`[Web Server] Đang chạy trên port ${PORT}`);
});

// ================= 5. ĐĂNG NHẬP BOT =================
const TOKEN = process.env.DISCORD_TOKEN || 'MTQ5ODI3MDM0MjMzNzEzNDY2Mw.GHiiXe.5GRXerafckZgF5KYxv-_is07Rbm7aGaNLXUULk';
client.login(TOKEN);