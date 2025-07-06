import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Trash2, Edit, Plus, ExternalLink, Calendar, User, Globe } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { CollectedData } from '@/integrations/supabase/custom-types'
import { useToast } from '@/hooks/use-toast'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'

const DataCollection = () => {
  const [collectedData, setCollectedData] = useState<CollectedData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    source_type: 'website' as CollectedData['source_type'],
    title: '',
    content: '',
    url: '',
    author: ''
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchCollectedData()
  }, [])

  const fetchCollectedData = async () => {
    try {
      const { data, error } = await supabase
        .from('collected_data')
        .select('*')
        .order('collected_at', { ascending: false })

      if (error) throw error
      setCollectedData((data || []) as CollectedData[])
    } catch (error: any) {
      toast({
        title: "データの取得に失敗しました",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const { error } = await supabase
        .from('collected_data')
        .insert([{
          source_type: formData.source_type,
          title: formData.title || null,
          content: formData.content || null,
          url: formData.url || null,
          author: formData.author || null,
          metadata: {}
        }])

      if (error) throw error

      toast({
        title: "データを追加しました",
        description: "新しいデータが正常に収集されました。",
      })

      setFormData({
        source_type: 'website',
        title: '',
        content: '',
        url: '',
        author: ''
      })
      setShowForm(false)
      fetchCollectedData()
    } catch (error: any) {
      toast({
        title: "データの追加に失敗しました",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('collected_data')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast({
        title: "データを削除しました",
        description: "選択したデータが削除されました。",
      })
      fetchCollectedData()
    } catch (error: any) {
      toast({
        title: "削除に失敗しました",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const getSourceIcon = (sourceType: CollectedData['source_type']) => {
    switch (sourceType) {
      case 'discord': return <Globe className="w-4 h-4" />
      case 'youtube': return <Globe className="w-4 h-4" />
      case 'website': return <Globe className="w-4 h-4" />
      case 'template': return <Globe className="w-4 h-4" />
      default: return <Globe className="w-4 h-4" />
    }
  }

  const getSourceColor = (sourceType: CollectedData['source_type']) => {
    switch (sourceType) {
      case 'discord': return 'bg-indigo-100 text-indigo-800 border-indigo-200'
      case 'youtube': return 'bg-red-100 text-red-800 border-red-200'
      case 'website': return 'bg-green-100 text-green-800 border-green-200'
      case 'template': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="w-16 h-16 gradient-neon rounded-2xl flex items-center justify-center mx-auto animate-glow mb-4">
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-muted-foreground">データを読み込み中...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">データ収集管理</h1>
            <p className="text-muted-foreground">
              各種ソースからデータを収集・管理します
            </p>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="gradient-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            新しいデータを追加
          </Button>
        </div>

        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>新しいデータを追加</CardTitle>
              <CardDescription>
                手動でデータを追加できます
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium">ソースタイプ</label>
                  <Select
                    value={formData.source_type}
                    onValueChange={(value: CollectedData['source_type']) => 
                      setFormData(prev => ({ ...prev, source_type: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="website">ウェブサイト</SelectItem>
                      <SelectItem value="discord">Discord</SelectItem>
                      <SelectItem value="youtube">YouTube</SelectItem>
                      <SelectItem value="template">テンプレート</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">タイトル</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="データのタイトルを入力"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">URL</label>
                  <Input
                    value={formData.url}
                    onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                    placeholder="https://example.com"
                    type="url"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">作成者</label>
                  <Input
                    value={formData.author}
                    onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                    placeholder="作成者名を入力"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">内容</label>
                  <Textarea
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="データの内容を入力"
                    rows={4}
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="gradient-primary">
                    追加
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                  >
                    キャンセル
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4">
          {collectedData.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Globe className="w-16 h-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">データがありません</h3>
                <p className="text-muted-foreground text-center mb-4">
                  まだ収集されたデータがありません。<br />
                  上の「新しいデータを追加」ボタンから開始してください。
                </p>
                <Button
                  onClick={() => setShowForm(true)}
                  className="gradient-primary"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  最初のデータを追加
                </Button>
              </CardContent>
            </Card>
          ) : (
            collectedData.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getSourceColor(item.source_type)}>
                          {getSourceIcon(item.source_type)}
                          <span className="ml-1 capitalize">{item.source_type}</span>
                        </Badge>
                        {item.processed && (
                          <Badge variant="secondary">処理済み</Badge>
                        )}
                      </div>

                      {item.title && (
                        <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                      )}

                      {item.content && (
                        <p className="text-muted-foreground mb-3 line-clamp-3">
                          {item.content}
                        </p>
                      )}

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {format(new Date(item.collected_at), 'yyyy年MM月dd日 HH:mm', { locale: ja })}
                        </div>
                        {item.author && (
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {item.author}
                          </div>
                        )}
                      </div>

                      {item.url && (
                        <div className="mt-2">
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline flex items-center gap-1 text-sm"
                          >
                            <ExternalLink className="w-3 h-3" />
                            ソースを表示
                          </a>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 ml-4">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>データを削除しますか？</AlertDialogTitle>
                            <AlertDialogDescription>
                              この操作は取り消すことができません。データは完全に削除されます。
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>キャンセル</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDelete(item.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              削除
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default DataCollection