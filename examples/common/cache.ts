import { helpers } from 'ngx-tethys/util';
const { isString, isNumber } = helpers;
const NUMBER_PREFIX = `____n____`;

const supportedStorage = window && window.localStorage;
const storageSource = window.localStorage || window.sessionStorage;

const cache = {
    /**
     * set item to local storage
     *
     * @example
     * cache.set('key1', 'key1-value');
     * cache.set('key1', 10);
     * cache.set('key1', { id: 1, name: 'name 1'});
     * cache.set('key1', 'key1-value', false);
     * @param key string
     * @param value string | number | object
     */
    set<TValue = string>(key: string, value: TValue) {
        const itemValue = isString(value)
            ? value
            : isNumber(value)
            ? `${NUMBER_PREFIX}${value}`
            : JSON.stringify(value);
        if (supportedStorage) {
            storageSource.setItem(key, itemValue as string);
        }
    },
    /**
     * get item from local storage
     *
     * @example
     * cache.get('key1');
     * cache.get<number>('key1');
     * cache.get<User>('key1');
     * cache.get<User[]>('key1');
     * cache.get('key1', false);
     *
     * @param key string
     */
    get<TValue = string>(key: string): TValue {
        if (supportedStorage) {
            const value = storageSource.getItem(key);
            if (value) {
                try {
                    const result = JSON.parse(value);
                    return result;
                } catch (error) {
                    if (isString(value) && value.includes(NUMBER_PREFIX)) {
                        return parseInt(value.replace(NUMBER_PREFIX, ''), 10) as any;
                    } else {
                        return value as any;
                    }
                }
            } else {
                return undefined;
            }
        } else {
            return undefined;
        }
    },
    /**
     * remove key from storage
     * @param key cache key
     */
    remove(key: string) {
        if (supportedStorage) {
            storageSource.removeItem(key);
        }
    },
    /**
     * clear all storage
     */
    clear() {
        if (supportedStorage) {
            storageSource.clear();
        }
    }
};

export { cache };
