import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Avatar, Paper, IconButton, Popover } from '@mui/material';
import { useSelector } from 'react-redux';
import SendIcon from '@mui/icons-material/Send';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import EmojiPicker from 'emoji-picker-react';
import { formatDistance } from 'date-fns';
import { tr } from 'date-fns/locale';
import { getComments, addComment, deleteComment } from '../lib/api';
import { toast } from '../utils/toast';
import DeleteIcon from '@mui/icons-material/Delete';

export function CommentSection({ blogSlug }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    fetchComments();
  }, [blogSlug]);

  const fetchComments = async () => {
    try {
      const response = await getComments(blogSlug);
      if (response.isSuccess) {
        setComments(response.data);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      const response = await addComment({
        blogSlug: blogSlug,
        content: newComment.trim()
      });

      if (response.isSuccess) {
        setNewComment('');
        await fetchComments();
        toast.success('Yorumunuz eklendi');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Yorum eklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const confirmed = await toast.confirm('Bu işlem geri alınamaz', 'Yorum Silmek İstediğinizden Emin Misiniz?');
      if (confirmed) {
        const response = await deleteComment(commentId);
        if (response.isSuccess) {
          await fetchComments();
          toast.success('Yorum başarıyla silindi');
        }
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Yorum silinirken bir hata oluştu');
    }
  };

  const handleEmojiClick = (emojiData) => {
    setNewComment(prev => prev + emojiData.emoji);
    setAnchorEl(null);
  };

  const handleEmojiButtonClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseEmojiPicker = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Yorumlar
      </Typography>
      
      {user ? (
        <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
          <Box sx={{ position: 'relative' }}>
            <TextField
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              placeholder="Yorumunuzu yazın..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              sx={{ mb: 2 }}
            />
            <IconButton
              onClick={handleEmojiButtonClick}
              sx={{
                position: 'absolute',
                right: 8,
                bottom: 24,
                color: 'text.secondary'
              }}
            >
              <EmojiEmotionsIcon />
            </IconButton>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button
              variant="contained"
              type="submit"
              disabled={loading}
              endIcon={<SendIcon />}
            >
              Yorum Yap
            </Button>
          </Box>
          <Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={handleCloseEmojiPicker}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </Popover>
        </Box>
      ) : (
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          Yorum yapmak için giriş yapmalısınız.
        </Typography>
      )}

      <Box sx={{ mt: 4 }}>
        {comments.map((comment) => (
          <Paper
            key={comment.id}
            elevation={1}
            sx={{
              p: 2,
              mb: 2,
              backgroundColor: 'background.paper',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ mr: 2 }} src={comment.authorImageUrl} />
                <Box>
                  <Typography variant="subtitle1">
                    {comment.authorName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatDistance(new Date(comment.createdAt), new Date(), {
                      addSuffix: true,
                      locale: tr
                    })}
                  </Typography>
                </Box>
              </Box>
              {comment.isMyComment && (
                <IconButton
                  onClick={() => handleDeleteComment(comment.id)}
                  size="small"
                  color="error"
                  aria-label="delete comment"
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </Box>
            <Typography variant="body1" sx={{ mt: 1 }}>
              {comment.content}
            </Typography>
          </Paper>
        ))}
      </Box>
    </Box>
  );
} 