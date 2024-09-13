**Color Reminder Extension**

This extension allows for users to input a reminder, set a time to be reminded, and save the reminder.
They will then be notified with a Chrome notification at the specified time with the input they saved.

**Overview**
This extension uses the storage, notification, and alarm API.

The storage API is used to add user reminders to Local Storage so that
user's HTML changes persist throughout the session.

The alarm and notification API work in tandem to trigger and notify the user of their reminder at the given time.

**Implementation Notes**
JavaScript event listeners are used to add interactivity to HTML elements.
API calls are made within event listeners.
