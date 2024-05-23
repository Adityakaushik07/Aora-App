import { Account, Avatars, Client, Databases, ID } from "react-native-appwrite";

export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.aditya.aora",
  projectId: "664ec5390016971947e6",
  databaseId: "664ec794000be5ccedbd",
  userCollectionId: "664ec8020004369b8f9c",
  videosCollectionId: "664ec84a000d2e713a53",
  storageId: "664ecb8c0018c1147435",
};
// Init your React Native SDK
const client = new Client();

client
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setPlatform(config.platform);

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client)

export const createUser = async (email, password, username) => {
  try {
    const newAccount = await new account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(username);

    await signIn(email,password);
    const newUser = await databases.createDocument(
      config.databaseId,
      config.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        username,
        email,
        password,
        avatar: avatarUrl
      }
    )
    return newUser
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export async function signIn(email,password){
  try {
    const session = await account.createEmailPasswordSession(email,password)
    return session
  } catch (error) {
    throw new Error(error)
    
  }
}