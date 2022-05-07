import firebase from 'firebase/app';
import { firestore } from './firestore';

export type MessageWithIdType = {
  id: string;
  type: string;
  content?: string;
  document?: string;
  isPhysician: boolean;
  createdAt: string;
}

export type MessageType = {
  type: string;
  content?: string;
  document?: string;
  isPhysician: boolean;
  createdAt: firebase.firestore.Timestamp | firebase.firestore.FieldValue;
}

export type CreateTextMessageType = {
  message: string;
}

export type CreateDocumentMessageType = {
  document: File;
}

export type PatientType = {
  messages: firebase.firestore.DocumentReference<firebase.firestore.DocumentData>[];
  test: string;
};

export const createPatient = async (userId: string) => {
  const patient: PatientType = {
    messages: [],
    test: 'New test value',
  };
  const db = await firestore();
  const patientRef = await db.collection('patients').doc(userId).set(patient);

  return patientRef;
};

export const getPatientDoc = async (userId: string) => {
  const db = await firestore();
  const patientRef = await db.collection('patients').doc(userId);
  return patientRef;
};

export const getMessage = async (messageRef: firebase.firestore.DocumentReference<firebase.firestore.DocumentData>): Promise<any> => {
  const message = await messageRef.get();
  return message;
};

export const createTextMessage = async (messageObject: CreateTextMessageType, userId: string) => {
  const message: MessageType = {
    type: 'text',
    content: messageObject.message,
    isPhysician: false,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  };
  const db = await firestore();
  const messageRef = await db.collection('messages').add(message);
  const patientRef = await db.collection('patients').doc(userId).update({
    messages: firebase.firestore.FieldValue.arrayUnion(messageRef),
  });
  return messageRef;
}

export const createDocumentMessage = async (messageObject: CreateDocumentMessageType, userId: string) => {
  const message: MessageType = {
    type: messageObject.document.type.includes('image') ? 'image' : 'document',
    isPhysician: false,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  };
  const db = await firestore();
  const messageRef = await db.collection('messages').add(message);
  const patientRef = await db.collection('patients').doc(userId).update({
    messages: firebase.firestore.FieldValue.arrayUnion(messageRef),
  });
  
  // Upload and save document url
  const documentPath = await uploadFile(messageRef.id, messageObject.document);
  const documentUrl = await getUrl(documentPath);
  messageRef.update('document', documentUrl);
  return messageRef;
}

const uploadFile = async (messageId: string, doc: File) => {
  const documentNameParts = doc.name.split('.');
  const mainDocumentPath = `/${messageId}-uniquesep-${documentNameParts[0] ?? ''}-uniquesep-${documentNameParts[1] ?? ''}-uniquesep-`;
  const storage = firebase.storage();
  const ref = storage.ref(mainDocumentPath);
  await ref.put(doc);
  return mainDocumentPath;
};

export const getUrl = async (path: string) => {
  const storage = firebase.storage();
  return await storage.ref(path).getDownloadURL();
};
