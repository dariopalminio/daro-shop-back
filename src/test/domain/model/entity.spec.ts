import { Entity } from "../../../domain/model/entity";

describe('Entity', () => {

    class EntityInstance extends Entity {

        protected name: string;

        constructor(id: string | undefined, name: string) {
            super(id);
            this.name = name;
        };

        public setName(value: string) {
            this.name = value;
        };

        public getName(): string {
            return this.name;
        };
    };


    describe('The Entity equals method', () => {

        it('Check that two entities are distinct', async () => {
            const instanceA = new EntityInstance('1','Maradona');
            const instanceB = new EntityInstance('2','Messi');

            expect(instanceA.equals(instanceB)).toBe(false);
        });

        it('Check that two entities are distinct', async () => {
            const instanceA = new EntityInstance('1','Richard Stallman');
            const instanceB = new EntityInstance('1','Richard Stallman');

            expect(instanceA.equals(instanceA)).toBe(true);
            expect(instanceA.equals(instanceB)).toBe(true);
        });

    });

    describe('Getters and setters', () => {

        it('GetId works with string id', async () => {
            const instanceA = new EntityInstance('1','Maradona');
            expect(instanceA.getId()).toBe('1');
        });

        it('GetId works with undefined id', async () => {
            const instanceB = new EntityInstance(undefined,'Messi');
            expect(instanceB.getId()).toBe(undefined);
        });
    
        it('Get and set attribute for mutability', async () => {
            let instanceB = new EntityInstance(undefined,'Maradona');
            instanceB.setName('Messi');
            expect(instanceB.getName()).toBe('Messi');
        });

    });

});