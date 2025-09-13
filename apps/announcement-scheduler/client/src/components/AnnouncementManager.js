import React, { useState, useEffect, useCallback } from 'react';
import {
  Page,
  Card,
  ResourceList,
  ResourceItem,
  Text,
  Button,
  Badge,
  Modal,
  Form,
  FormLayout,
  TextField,
  Toast,
  Frame,
  Loading,
  EmptyState,
  ButtonGroup,
  InlineStack,
  BlockStack,
  Checkbox
} from '@shopify/polaris';
import { PlusIcon, EditIcon, DeleteIcon } from '@shopify/polaris-icons';
import axios from 'axios';

function AnnouncementManager() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [toast, setToast] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    background_color: '#000000',
    text_color: '#ffffff',
    link_url: '',
    is_active: true
  });

  // Load announcements
  const loadAnnouncements = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/announcements');
      setAnnouncements(response.data.data || []);
    } catch (error) {
      console.error('Error loading announcements:', error);
      setToast({ content: 'Error loading announcements', error: true });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAnnouncements();
  }, [loadAnnouncements]);

  // Handle form submit
  const handleSubmit = async () => {
    try {
      const submitData = {
        ...formData,
        start_date: new Date(formData.start_date).toISOString(),
        end_date: new Date(formData.end_date).toISOString()
      };

      if (editingAnnouncement) {
        await axios.put(`/api/announcements/${editingAnnouncement.id}`, submitData);
        setToast({ content: 'Announcement updated successfully' });
      } else {
        await axios.post('/api/announcements', submitData);
        setToast({ content: 'Announcement created successfully' });
      }

      setModalOpen(false);
      resetForm();
      loadAnnouncements();
    } catch (error) {
      console.error('Error saving announcement:', error);
      setToast({ content: 'Error saving announcement', error: true });
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      message: '',
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      background_color: '#000000',
      text_color: '#ffffff',
      link_url: '',
      is_active: true
    });
    setEditingAnnouncement(null);
  };

  // Handle edit
  const handleEdit = (announcement) => {
    setFormData({
      title: announcement.title,
      message: announcement.message,
      start_date: announcement.start_date.split('T')[0],
      end_date: announcement.end_date.split('T')[0],
      background_color: announcement.background_color,
      text_color: announcement.text_color,
      link_url: announcement.link_url || '',
      is_active: Boolean(announcement.is_active)
    });
    setEditingAnnouncement(announcement);
    setModalOpen(true);
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      try {
        await axios.delete(`/api/announcements/${id}`);
        setToast({ content: 'Announcement deleted successfully' });
        loadAnnouncements();
      } catch (error) {
        console.error('Error deleting announcement:', error);
        setToast({ content: 'Error deleting announcement', error: true });
      }
    }
  };

  // Check if announcement is currently active
const isActive = (announcement) => {
  if (!announcement) {
    return false;
  }

  const now = new Date();
  const start = new Date(announcement.start_date);
  const end = new Date(announcement.end_date);

  return announcement.is_active && start <= now && now <= end;
};

  // Render announcement item
const renderAnnouncementItem = (item) => {
  if (!item) return null;

  const active = isActive(item);

  return (
    <ResourceItem
      id={String(item.id)}
      accessibilityLabel={`Announcement ${item.title || ''}`}
    >
      <InlineStack align="center" gap="400" blockAlign="center">
        <BlockStack grow>
          <Text as="span" variant="bodyMd" fontWeight="bold">
            {item.title || '(Untitled)'}
          </Text>
          <Text as="span" tone="subdued">
            {item.message || ''}
          </Text>
          <div style={{ marginTop: '8px' }}>
            <Badge status={active ? 'success' : 'default'}>
              {active ? 'Active' : 'Inactive'}
            </Badge>
            <span style={{ marginLeft: '8px', fontSize: '12px', color: '#637381' }}>
              {item.start_date && item.end_date
                ? `${new Date(item.start_date).toLocaleDateString()} - ${new Date(item.end_date).toLocaleDateString()}`
                : 'No dates'}
            </span>
          </div>
        </BlockStack>
        <ButtonGroup>
          <Button icon={EditIcon} onClick={() => handleEdit(item)} size="slim">
            Edit
          </Button>
          <Button
            icon={DeleteIcon}
            onClick={() => handleDelete(item.id)}
            destructive
            size="slim"
          >
            Delete
          </Button>
        </ButtonGroup>
      </InlineStack>
    </ResourceItem>
  );
    
  };

  // Toast component
  const toastMarkup = toast ? (
    <Toast content={toast.content} error={toast.error} onDismiss={() => setToast(null)} />
  ) : null;

  if (loading) {
    return (
      <Frame>
        <Loading />
      </Frame>
    );
  }

  return (
    <Frame>
      <Page
        title="Announcement Scheduler"
        primaryAction={{
          content: 'Create Announcement',
          icon: PlusIcon,
          onAction: () => {
            resetForm();
            setModalOpen(true);
          }
        }}
      >
        <Card>
          {announcements.length === 0 ? (
            <EmptyState
              heading="Create your first announcement"
              action={{
                content: 'Create Announcement',
                onAction: () => {
                  resetForm();
                  setModalOpen(true);
                }
              }}
              image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
            >
              <p>
                Schedule custom announcement bars for your storefront with specific dates and
                styling.
              </p>
            </EmptyState>
          ) : (
            <ResourceList
              resourceName={{ singular: 'announcement', plural: 'announcements' }}
              items={announcements}
              renderItem={renderAnnouncementItem}
            />
          )}
        </Card>

        <Modal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            resetForm();
          }}
          title={editingAnnouncement ? 'Edit Announcement' : 'Create Announcement'}
          primaryAction={{
            content: editingAnnouncement ? 'Update' : 'Create',
            onAction: handleSubmit
          }}
          secondaryActions={[
            {
              content: 'Cancel',
              onAction: () => {
                setModalOpen(false);
                resetForm();
              }
            }
          ]}
        >
          <Modal.Section>
            <Form onSubmit={handleSubmit}>
              <FormLayout>
                <TextField
                  label="Title"
                  value={formData.title}
                  onChange={(value) => setFormData({ ...formData, title: value })}
                  placeholder="e.g., Black Friday Sale"
                />

                <TextField
                  label="Message"
                  value={formData.message}
                  onChange={(value) => setFormData({ ...formData, message: value })}
                  placeholder="e.g., Get 50% off everything! Use code: BLACKFRIDAY"
                  multiline={3}
                />

                <FormLayout.Group>
                  <TextField
                    label="Start Date"
                    type="date"
                    value={formData.start_date}
                    onChange={(value) => setFormData({ ...formData, start_date: value })}
                  />
                  <TextField
                    label="End Date"
                    type="date"
                    value={formData.end_date}
                    onChange={(value) => setFormData({ ...formData, end_date: value })}
                  />
                </FormLayout.Group>

                <FormLayout.Group>
                  <TextField
                    label="Background Color"
                    type="color"
                    value={formData.background_color}
                    onChange={(value) => setFormData({ ...formData, background_color: value })}
                  />
                  <TextField
                    label="Text Color"
                    type="color"
                    value={formData.text_color}
                    onChange={(value) => setFormData({ ...formData, text_color: value })}
                  />
                </FormLayout.Group>

                <TextField
                  label="Link URL (Optional)"
                  value={formData.link_url}
                  onChange={(value) => setFormData({ ...formData, link_url: value })}
                  placeholder="https://example.com/sale"
                />

                <Checkbox
                  label="Active"
                  checked={formData.is_active}
                  onChange={(value) => setFormData({ ...formData, is_active: value })}
                />
              </FormLayout>
            </Form>
          </Modal.Section>
        </Modal>
      </Page>
      {toastMarkup}
    </Frame>
  );
}

export default AnnouncementManager;
