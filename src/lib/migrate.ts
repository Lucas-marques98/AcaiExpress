import { collection, doc, setDoc, getDocs, writeBatch } from 'firebase/firestore';
import { db } from './firebase';
import { 
  stores, 
  plans, 
  products, 
  categories, 
  neighborhoods, 
  subscriptions, 
  onboardingChecklists, 
  billingRecords,
  users
} from '../mockData';

export const migrateData = async () => {
  console.log('Starting migration...');
  
  try {
    // 1. Migrate Plans
    for (const plan of plans) {
      await setDoc(doc(db, 'plans', plan.id), plan);
    }
    console.log('Plans migrated');

    // 2. Migrate Stores
    for (const store of stores) {
      await setDoc(doc(db, 'stores', store.id), store);
    }
    console.log('Stores migrated');

    // 3. Migrate Users
    for (const user of users) {
      await setDoc(doc(db, 'users', user.id), user);
    }
    console.log('Users migrated');

    // 4. Migrate Categories
    for (const category of categories) {
      await setDoc(doc(db, 'categories', category.id), category);
    }
    console.log('Categories migrated');

    // 5. Migrate Products
    for (const product of products) {
      await setDoc(doc(db, 'products', product.id), product);
    }
    console.log('Products migrated');

    // 6. Migrate Neighborhoods
    for (const neighborhood of neighborhoods) {
      await setDoc(doc(db, 'neighborhoods', neighborhood.id), neighborhood);
    }
    console.log('Neighborhoods migrated');

    // 7. Migrate Subscriptions
    for (const sub of subscriptions) {
      await setDoc(doc(db, 'subscriptions', sub.id), sub);
    }
    console.log('Subscriptions migrated');

    // 8. Migrate Onboarding
    for (const onboarding of onboardingChecklists) {
      await setDoc(doc(db, 'onboarding', onboarding.id), onboarding);
    }
    console.log('Onboarding migrated');

    // 9. Migrate Billing
    for (const billing of billingRecords) {
      await setDoc(doc(db, 'billing', billing.id), billing);
    }
    console.log('Billing migrated');

    console.log('Migration completed successfully!');
    return true;
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
};
