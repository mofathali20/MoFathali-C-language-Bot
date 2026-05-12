import { Telegraf, Markup } from "telegraf";
import { logger } from "./lib/logger";
import path from "node:path";
import { Input } from "telegraf";
// import { db, botUsers } from "@workspace/db";
import { eq, count } from "drizzle-orm";
import { quiz1, quiz2 } from "./content/quizzes";

const token = process.env["TELEGRAM_BOT_TOKEN"];
if (!token) throw new Error("TELEGRAM_BOT_TOKEN is required");

const adminId = Number(process.env["ADMIN_TELEGRAM_ID"]);

export const bot = new Telegraf(token);

const filesDir = path.join(__dirname, "files");

const WELCOME =
  `🎓 *أهلاً بك في بوت مادة لغة C*\n` +
  `*Welcome to C Language Bot*\n\n` +
  `اختر من القائمة أدناه:`;

const BTN = {
  EXAMS:    "📄 أسئلة الامتحانات",
  CURRICULUM: "📚 المنهج والأمثلة",
  QUIZZES:  "📝 كويزات",
  CODEBLOCKS: "💻 Code::Blocks",
  OUR_BOTS: "🤖 البوتات الخاصة بنا",
  DESIGNER: "👨‍💻 مصمم البوت",
};

const replyKeyboard = Markup.keyboard([
  [BTN.EXAMS, BTN.CURRICULUM],
  [BTN.QUIZZES, BTN.CODEBLOCKS],
  [BTN.OUR_BOTS, BTN.DESIGNER],
]).resize();

const quizzesMenu = Markup.inlineKeyboard([
  [Markup.button.callback("📝 كويز 1", "quiz_1")],
  [Markup.button.callback("📝 كويز 2", "quiz_2")],
  [Markup.button.callback("🔙 رجوع", "back_main")],
]);

async function saveUser(from: { id: number; first_name: string; last_name?: string; username?: string }) {
  try {
    const existing = await db
      .select({ telegramId: botUsers.telegramId })
      .from(botUsers)
      .where(eq(botUsers.telegramId, from.id))
      .limit(1);

    const isNew = existing.length === 0;

    await db
      .insert(botUsers)
      .values({
        telegramId: from.id,
        firstName: from.first_name,
        lastName: from.last_name ?? null,
        username: from.username ?? null,
      })
      .onConflictDoUpdate({
        target: botUsers.telegramId,
        set: {
          firstName: from.first_name,
          lastName: from.last_name ?? null,
          username: from.username ?? null,
          lastSeenAt: new Date(),
        },
      });

    if (isNew && adminId) {
      const name = [from.first_name, from.last_name].filter(Boolean).join(" ");
      const user = from.username ? `@${from.username}` : `ID: ${from.id}`;
      await bot.telegram.sendMessage(
        adminId,
        `🆕 *طالب جديد دخل البوت!*\n\n👤 الاسم: ${name}\n🔗 اليوزر: ${user}`,
        { parse_mode: "Markdown" }
      );
    }
  } catch (err) {
    logger.error({ err }, "Failed to save user");
  }
}

async function sendWelcome(ctx: any) {
  if (ctx.from) await saveUser(ctx.from);
  await ctx.replyWithPhoto(
    Input.fromLocalFile(path.join(filesDir, "welcome.png")),
    { caption: WELCOME, parse_mode: "Markdown", ...replyKeyboard }
  );
}

async function sendExams(ctx: any) {
  await ctx.replyWithDocument(Input.fromLocalFile(path.join(filesDir, "exam_questions.pdf"), "أسئلة_الامتحانات.pdf"));
  await ctx.replyWithDocument(Input.fromLocalFile(path.join(filesDir, "midterm_beta.pdf"), "امتحان_نصفي_بيتا.pdf"));
  await ctx.replyWithDocument(Input.fromLocalFile(path.join(filesDir, "collection.pdf"), "تجميع_أسئلة_الامتحانات.pdf"));
}

async function sendCurriculum(ctx: any) {
  await ctx.replyWithDocument(Input.fromLocalFile(path.join(filesDir, "curriculum.pdf"), "منهج_لغة_السي.pdf"));
  await ctx.replyWithDocument(Input.fromLocalFile(path.join(filesDir, "examples.pdf"), "أمثلة_في_لغة_السي.pdf"));
}

async function sendOurBots(ctx: any) {
  await ctx.reply(
    `🤖 *البوتات الخاصة بنا:*\n\n` +
    `🖥️ بوت مادة تنظيم الحاسبات\n@coccttbot\n\n` +
    `💡 بوت مادة الأنظمة الرقمية\n@digitalccttbot\n\n` +
    `📐 بوت مادة الرياضة 1\n@Calc1CCTTbot\n\n` +
    `💻 بوت لغة C التعليمي\n@C_CCTT_bot\n\n` +
    `⏳ انتظروا بقية المواد ...\n\n` +
    `——————————————\n` +
    `🏢 حسيبات تيك | Hisabat Tech`,
    { parse_mode: "Markdown" }
  );
}

async function sendQuiz(ctx: any, questions: typeof quiz1, title: string) {
  await ctx.reply(
    `📝 *${title} — لغة C*\n\nيتكون من ${questions.length} أسئلة. اختر الإجابة الصحيحة لكل سؤال! 🎯`,
    { parse_mode: "Markdown" }
  );
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    await ctx.reply(`❓ *سؤال ${i + 1}*\n\n\`\`\`c\n${q.code}\n\`\`\``, {
      parse_mode: "Markdown",
    });
    await ctx.replyWithPoll(q.question, q.options, {
      type: "quiz",
      correct_option_id: q.correctIndex,
      is_anonymous: false,
    });
  }
}

bot.start(async (ctx) => {
  await sendWelcome(ctx);
});

bot.command("stats", async (ctx) => {
  if (ctx.from?.id !== adminId) return;

  const [{ value: total }] = await db.select({ value: count() }).from(botUsers);
  const allUsers = await db.select().from(botUsers).orderBy(botUsers.joinedAt);

  const lines = allUsers.map((u, i) => {
    const name = [u.firstName, u.lastName].filter(Boolean).join(" ");
    const user = u.username ? `@${u.username}` : `ID: ${u.telegramId}`;
    const date = u.joinedAt.toLocaleDateString("ar-LY");
    return `${i + 1}. ${name} | ${user} | ${date}`;
  });

  const text =
    `📊 *إحصائيات البوت*\n\n` +
    `👥 إجمالي المستخدمين: *${total}*\n\n` +
    (lines.length > 0 ? lines.join("\n") : "لا يوجد مستخدمون بعد");

  const chunks: string[] = [];
  let current = text;
  while (current.length > 4000) {
    const split = current.lastIndexOf("\n", 4000);
    chunks.push(current.slice(0, split));
    current = current.slice(split + 1);
  }
  chunks.push(current);

  for (const chunk of chunks) {
    await ctx.reply(chunk, { parse_mode: "Markdown" });
  }
});

bot.command("broadcast", async (ctx) => {
  if (ctx.from?.id !== adminId) return;

  const text = ctx.message.text.replace(/^\/broadcast\s*/i, "").trim();
  if (!text) {
    await ctx.reply("⚠️ اكتب الرسالة بعد الأمر:\n/broadcast نص الرسالة هنا");
    return;
  }

  const allUsers = await db.select({ telegramId: botUsers.telegramId }).from(botUsers);
  let success = 0;
  let failed = 0;

  for (const user of allUsers) {
    try {
      await bot.telegram.sendMessage(user.telegramId, text);
      success++;
    } catch {
      failed++;
    }
  }

  await ctx.reply(`✅ تم الإرسال!\n\n📨 وصلت لـ: ${success} طالب\n❌ فشل: ${failed}`);
});

bot.hears(BTN.EXAMS, async (ctx) => {
  if (ctx.from) await saveUser(ctx.from);
  await sendExams(ctx);
});

bot.hears(BTN.CURRICULUM, async (ctx) => {
  if (ctx.from) await saveUser(ctx.from);
  await sendCurriculum(ctx);
});

bot.hears(BTN.QUIZZES, async (ctx) => {
  if (ctx.from) await saveUser(ctx.from);
  await ctx.reply("📝 *كويزات لغة C*\n\nاختر الكويز:", {
    parse_mode: "Markdown",
    ...quizzesMenu,
  });
});

bot.hears(BTN.CODEBLOCKS, async (ctx) => {
  if (ctx.from) await saveUser(ctx.from);
  await ctx.reply(
    "💻 *تحميل برنامج Code\\:\\:Blocks*\n\nاضغط على الرابط أدناه لتحميل البرنامج:",
    {
      parse_mode: "MarkdownV2",
      ...Markup.inlineKeyboard([
        [Markup.button.url("⬇️ تحميل Code::Blocks", "https://sourceforge.net/projects/codeblocks/files/Binaries/12.11")],
      ]),
    }
  );
});

bot.hears(BTN.OUR_BOTS, async (ctx) => {
  if (ctx.from) await saveUser(ctx.from);
  await sendOurBots(ctx);
});

bot.hears(BTN.DESIGNER, async (ctx) => {
  if (ctx.from) await saveUser(ctx.from);
  await ctx.reply(
    "👨‍💻 *مصمم البوت*\n\nللتواصل مع مصمم البوت:",
    {
      parse_mode: "Markdown",
      ...Markup.inlineKeyboard([
        [Markup.button.url("💬 تواصل مع المصمم", "https://t.me/Mo_Fat7ali")],
      ]),
    }
  );
});

bot.on("message", async (ctx) => {
  if (ctx.from) await saveUser(ctx.from);
  await sendWelcome(ctx);
});

bot.action("send_all", async (ctx) => {
  await ctx.answerCbQuery();
  await sendExams(ctx);
});

bot.action("send_curriculum", async (ctx) => {
  await ctx.answerCbQuery();
  await sendCurriculum(ctx);
});

bot.action("quizzes_menu", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply("📝 *كويزات لغة C*\n\nاختر الكويز:", {
    parse_mode: "Markdown",
    ...quizzesMenu,
  });
});

bot.action("back_main", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.replyWithPhoto(
    Input.fromLocalFile(path.join(filesDir, "welcome.png")),
    { caption: WELCOME, parse_mode: "Markdown", ...replyKeyboard }
  );
});

bot.action("quiz_1", async (ctx) => {
  await ctx.answerCbQuery();
  if (quiz1.length === 0) {
    await ctx.reply("⏳ سيتم إضافة كويز 1 قريباً...");
    return;
  }
  await sendQuiz(ctx, quiz1, "كويز 1");
});

bot.action("quiz_2", async (ctx) => {
  await ctx.answerCbQuery();
  if (quiz2.length === 0) {
    await ctx.reply("⏳ سيتم إضافة كويز 2 قريباً...");
    return;
  }
  await sendQuiz(ctx, quiz2, "كويز 2");
});

bot.action("our_bots", async (ctx) => {
  await ctx.answerCbQuery();
  await sendOurBots(ctx);
});

export function startBot() {
  bot.launch({ dropPendingUpdates: true });
  logger.info("Telegram bot started");
  process.once("SIGINT", () => bot.stop("SIGINT"));
  process.once("SIGTERM", () => bot.stop("SIGTERM"));
}
