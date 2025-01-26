import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Avatar, Paper } from '@mui/material';
import { useSelector } from 'react-redux';
import SendIcon from '@mui/icons-material/Send';
import { formatDistance } from 'date-fns';
import { tr } from 'date-fns/locale';
import { getComments, addComment, deleteComment } from '../lib/api';
import Swal from 'sweetalert2';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';

export function CommentSection({ blogSlug }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
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
        blogId: blogSlug,
        content: newComment.trim()
      });

      if (response.isSuccess) {
        setNewComment('');
        await fetchComments();
        Swal.fire({
          title: 'Başarılı',
          text: 'Yorumunuz eklendi',
          icon: 'success',
          background: '#0f172a',
          color: '#f1f5f9',
        });
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      Swal.fire({
        title: 'Hata',
        text: 'Yorum eklenirken bir hata oluştu',
        icon: 'error',
        background: '#0f172a',
        color: '#f1f5f9',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
        // pop up  user with swal if he is sure to delete the comment
        const result = await Swal.fire({
          title: 'Yorum Silmek İstediğinizden Emin Misiniz?',
          text: 'Bu işlem geri alınamaz',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sil',
          cancelButtonText: 'Vazgeç'
        });
        if (result.isConfirmed) {
          const response = await deleteComment(commentId);
          if (response.isSuccess) {
            await fetchComments();
          }
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      Swal.fire({
        title: 'Hata',
        text: 'Yorum silinirken bir hata oluştu',
        icon: 'error',
        background: '#0f172a',
        color: '#f1f5f9',
      });
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Yorumlar
      </Typography>
      
      {user ? (
        <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
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
          <Button
            variant="contained"
            type="submit"
            disabled={loading}
            endIcon={<SendIcon />}
          >
            Yorum Yap
          </Button>
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