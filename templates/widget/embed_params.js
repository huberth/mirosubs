{ 
    uuid: '{{uuid}}', 
    video_id: '{{video_id}}', 
    youtube_videoid: '{{youtube_videoid}}',
    show_tab: {{show_tab}},
    username: '{{request.user.username|escapejs}}',
    base_rpc_url: 'http://{{site.domain}}/widget/rpc/',
    base_login_url: 'http://{{site.domain}}/widget/',
    null_widget: {{null_widget}},
    writelock_expiration: {{writelock_expiration}},
    translation_languages: {{translation_languages}}
}