import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

const SCRAPER_SCRIPT = `// Discordスクレイピング自動化スクリプト\n(async function() {\n  const getChannels = () => Array.from(document.querySelectorAll('[class*="containerDefault-"]')).filter(el => el.textContent.trim() && el.querySelector('[class*="name-"]')).map(el => ({ name: el.textContent.trim(), element: el }));\n  const getMessages = () => Array.from(document.querySelectorAll('[id^="chat-messages-"] [class*="messageListItem-"]')).map(item => {\n    const user = item.querySelector('h3 span[class*="username-"]')?.textContent || "";\n    const time = item.querySelector('time')?.getAttribute("datetime") || "";\n    const content = Array.from(item.querySelectorAll('[class*="messageContent"]')).map(el => el.textContent.trim()).join("\n");\n    const attachments = Array.from(item.querySelectorAll('a[href], img[src]')).map(a => a.href || a.src);\n    const threadTitle = item.querySelector('[class*="threadName-"]')?.textContent || "";\n    return { user, time, content, attachments, threadTitle };\n  });\n  window.extractAllChannels = async function() {\n    const channels = getChannels();\n    let allData = {};\n    for (const ch of channels) {\n      ch.element.click();\n      await new Promise(r => setTimeout(r, 2000));\n      allData[ch.name] = getMessages();\n    }\n    const blob = new Blob([JSON.stringify(allData, null, 2)], {type : 'application/json'});\n    const url = URL.createObjectURL(blob);\n    const a = document.createElement('a');\n    a.href = url; a.download = 'discord_export.json'; a.click();\n    URL.revokeObjectURL(url);\n    alert('全チャンネル抽出完了！');\n  };\n  /* Consoleで extractAllChannels() を実行 */\n})();`;

export default function DiscordScrapingHelper() {
  const [discordUrl, setDiscordUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(SCRAPER_SCRIPT);
    setCopied(true);
    toast({ title: "スクリプトをコピーしました", description: "DiscordのConsoleに貼り付けてください。" });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Discordスクレイピング支援</CardTitle>
        <CardDescription>
          Discordの全チャンネル・メッセージ・スレッド・添付ファイルを抽出できます。<br />
          <b>【使い方】</b><br />
          ① 下記URLをコピーしてDiscordにアクセス<br />
          ② 「スクリプトコピー」ボタンでスクリプトをコピー<br />
          ③ Discord画面でF12→Consoleに貼り付けて実行<br />
          ④ Consoleで <code>extractAllChannels()</code> を実行→自動でjsonダウンロード<br />
          ⑤ 取得したjsonをこのアプリにインポート
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          label="DiscordサーバーURL"
          value={discordUrl}
          onChange={e => setDiscordUrl(e.target.value)}
          placeholder="https://discord.com/channels/サーバーID/チャンネルID"
        />
        <Button onClick={() => { navigator.clipboard.writeText(discordUrl); toast({ title: "URLをコピーしました" }); }}>
          サーバーURLをコピー
        </Button>
        <Textarea value={SCRAPER_SCRIPT} readOnly rows={8} className="font-mono" />
        <Button onClick={handleCopy} variant={copied ? "secondary" : "default"}>
          {copied ? "コピー済み！" : "スクリプトコピー"}
        </Button>
      </CardContent>
    </Card>
  );
}
