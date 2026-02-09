import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from './auth';
import { query } from '../config/database';

export const logAction = async (
  req: AuthRequest,
  action: string,
  entityType?: string,
  entityId?: string,
  details?: any
) => {
  try {
    await query(
      `INSERT INTO audit_log (user_id, action, entity_type, entity_id, details, ip_address, user_agent)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        req.user?.userId || null,
        action,
        entityType || null,
        entityId || null,
        details ? JSON.stringify(details) : null,
        req.ip,
        req.get('user-agent') || null
      ]
    );
  } catch (error) {
    console.error('Error logging action:', error);
  }
};

export const auditLogger = (action: string, entityType?: string) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    const originalJson = res.json.bind(res);
    
    res.json = function (body: any) {
      if (body.success) {
        const entityId = body.data?.id || req.params.id || null;
        logAction(req, action, entityType, entityId, {
          method: req.method,
          path: req.path,
          body: req.body
        });
      }
      return originalJson(body);
    };
    
    next();
  };
};
