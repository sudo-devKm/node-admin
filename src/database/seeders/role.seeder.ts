import { Permission } from "@app/entities/permission.entity";
import { Role } from "@app/entities/role.entity";
import logger from "@app/libs/logger";
import { AppDataSource } from "@database/data-source";
import _ from "lodash";
import { In } from "typeorm";

const seedSysGeneratedRoles = async () => {
    try {
        // create connection.
        await AppDataSource.initialize();
        // start transaction.
        await AppDataSource.transaction(async (manager) => {
            // get repository.
            const permissionRepo = manager.getRepository(Permission);
            const roleRepo = manager.getRepository(Role);
            // seed permissions.
            const seedPermissions = ["view_users", "edit_users", "view_roles", "edit_roles", "view_products", "edit_products", "view_orders", "edit_orders"];
            // create permissions.
            const insertResult = await permissionRepo.insert(_.map(seedPermissions ?? [], (permission) => {
                return { name: permission }
            }));
            // get all inserted permissions.
            const permissions = await permissionRepo.find({ where: { id: In(_.map(insertResult.identifiers ?? [], (inserted) => inserted?.id)) } });
            // create Admin role.
            const adminRole = roleRepo.create({ name: 'Admin', permissions });
            await roleRepo.save(adminRole);
            // create Editor role.
            const editorPermissions = _.filter(permissions ?? [], (permission) => permission.name !== 'edit_roles');
            const editorRole = roleRepo.create({ name: 'Editor', permissions: editorPermissions });
            await roleRepo.save(editorRole);
            // create viewer role.
            const viewPermissions = _.filter(permissions ?? [], (permission) => permission.name.startsWith("view_"));
            const viewerRole = roleRepo.create({ name: 'Viewer', permissions: viewPermissions });
            await roleRepo.save(viewerRole);
        });
    } catch (err) {
        logger.info("[Seeder] [seedSysGeneratedRoles] Error occurred while running seeder.");
    } finally {
        await AppDataSource.destroy();
        process.exit(0);
    };
};

seedSysGeneratedRoles();