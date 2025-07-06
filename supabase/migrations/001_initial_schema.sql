-- TOFUラボ週刊情報誌 データベーススキーマ
-- 作成日: 2024-01-XX

-- 1. 週刊号テーブル
CREATE TABLE weekly_issues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    week_period VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    summary TEXT,
    content JSONB,
    highlights TEXT[],
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    wordpress_post_id INTEGER,
    wordpress_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    
    -- インデックス
    CONSTRAINT unique_week_period UNIQUE(week_period)
);

-- 2. 収集データテーブル
CREATE TABLE collected_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_type VARCHAR(20) NOT NULL CHECK (source_type IN ('discord', 'youtube', 'website', 'template')),
    title VARCHAR(500),
    content TEXT,
    url VARCHAR(1000),
    author VARCHAR(255),
    metadata JSONB DEFAULT '{}',
    collected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed BOOLEAN DEFAULT FALSE,
    issue_id UUID REFERENCES weekly_issues(id) ON DELETE CASCADE,
    
    -- メタデータ用のインデックス
    INDEX (source_type),
    INDEX (collected_at),
    INDEX (processed)
);

-- 3. 投稿履歴テーブル
CREATE TABLE post_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    issue_id UUID REFERENCES weekly_issues(id) ON DELETE CASCADE,
    wordpress_post_id INTEGER,
    wordpress_url TEXT,
    posted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'success' CHECK (status IN ('success', 'failed', 'pending')),
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    
    INDEX (issue_id),
    INDEX (posted_at)
);

-- 4. 設定テーブル
CREATE TABLE user_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) UNIQUE,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. API統計テーブル（使用量監視用）
CREATE TABLE api_usage_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service VARCHAR(50) NOT NULL,
    endpoint VARCHAR(200),
    requests_count INTEGER DEFAULT 0,
    date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(service, endpoint, date)
);

-- RLS (Row Level Security) ポリシー設定
ALTER TABLE weekly_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE collected_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_usage_stats ENABLE ROW LEVEL SECURITY;

-- ポリシー: 認証済みユーザーのみアクセス可能
CREATE POLICY "Users can manage their own data" ON weekly_issues
    FOR ALL USING (auth.uid() = created_by OR auth.uid() IS NOT NULL);

CREATE POLICY "Users can access collected data" ON collected_data
    FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can access post history" ON post_history
    FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can manage their settings" ON user_settings
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admin can access API stats" ON api_usage_stats
    FOR ALL USING (auth.uid() IS NOT NULL);

-- 更新日時の自動更新用のトリガー関数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language plpgsql;

-- トリガーの設定
CREATE TRIGGER update_weekly_issues_updated_at 
    BEFORE UPDATE ON weekly_issues 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at 
    BEFORE UPDATE ON user_settings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 初期設定データ
INSERT INTO user_settings (user_id, settings) 
SELECT 
    auth.uid(),
    '{
        "notifications": {
            "discord": true,
            "email": true,
            "slack": false
        },
        "automation": {
            "auto_collect": true,
            "auto_publish": false,
            "collection_frequency": "weekly"
        },
        "wordpress": {
            "site_url": "",
            "username": "",
            "application_password": ""
        }
    }'::jsonb
WHERE auth.uid() IS NOT NULL
ON CONFLICT (user_id) DO NOTHING;