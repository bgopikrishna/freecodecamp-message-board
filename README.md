### Freecodecamp **ISQA Project** - Anon Message Board

[https://freecodecamp.org/bgopikrisha](https://freecodecamp.org/bgopikrishna)


#### Checklist

- [x] Only allow your site to be loading in an iFrame on your own pages.
- [x] Do not allow DNS prefetching.
- [x] Only allow your site to send the referrer for your own pages.
- [x] I can **POST** a thread to a specific message board by passing form data `text` and `delete_password` to */api/threads/{board}*.(Recomend res.redirect to board page /b/{board}) Saved will be `_id`, `text`, `created_on`(date&time), `bumped_on`(date&time, starts same as created_on), `reported`(boolean), `delete_password`, & `replies`(array).
- [x] I can **POST** a reply to a thead on a specific board by passing form data `text`, `delete_password`, & `thread_id` to */api/replies/{board}* and it will also update the bumped_on date to the comments date.(Recomend res.redirect to thread page /b/{board}/{thread_id}) In the thread's 'replies' array will be saved `_id`, `text`, `created_on`, `delete_password`, & `reported`.
- [x] I can **GET** an array of the most recent 10 bumped threads on the board with only the most recent 3 replies from */api/threads/{board}*. The `reported` and `delete_passwords` fields will not be sent.
- [x] I can **GET** an entire thread with all it's replies from */api/replies/{board}?thread_id={thread_id}*. Also hiding the same fields.
- [x] I can delete a thread completely if I send a **DELETE** request to */api/threads/{board}* and pass along the `thread_id` & `delete_password`. (Text response will be 'incorrect password' or 'success')
- [x] I can delete a post(just changing the text to '[deleted]') if I send a **DELETE** request to */api/replies/{board}* and pass along the `thread_id`, `reply_id`, & `delete_password`. (Text response will be 'incorrect password' or 'success')
- [x] I can report a thread and change it's reported value to true by sending a **PUT** request to */api/threads/{board}* and pass along the `thread_id`. (Text response will be 'success')
- [x] I can report a reply and change it's reported value to true by sending a **PUT** request to */api/replies/{board}* and pass along the `thread_id` & `reply_id`. (Text response will be 'success')
- [x] Complete functional tests that wholely test routes and pass.



![](https://cdn.gomix.com/8f5547a1-a0d6-48f6-aa38-51753a0105f4%2FScreen%20Shot%202017-01-02%20at%201.04.10%20AM.png)