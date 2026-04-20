'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

interface WeChatShareGuideProps {
  show: boolean;
  onClose: () => void;
}

export function WeChatShareGuide({ show, onClose }: WeChatShareGuideProps) {
  const t = useTranslations('Result');

  const handleClose = () => {
    sessionStorage.setItem('wechat_share_guided', '1');
    onClose();
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          {/* Arrow pointing to top-right ··· button */}
          <motion.div
            className="absolute top-[56px] right-6"
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <div
              style={{
                width: 0,
                height: 0,
                borderLeft: '12px solid transparent',
                borderRight: '12px solid transparent',
                borderBottom: '16px solid white',
              }}
            />
          </motion.div>

          {/* Card */}
          <motion.div
            className="card-mystic rounded-2xl max-w-sm p-6 mx-auto mt-[30vh]"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <p className="text-lg font-title text-gold mb-2">
                {t('wechatShareTitle')}
              </p>
              <p className="text-[var(--theme-text-muted)] text-sm mb-6">
                {t('wechatShareDesc')}
              </p>
              <button
                onClick={handleClose}
                className="btn-divine h-10 px-6 text-sm font-title tracking-wider rounded-lg"
              >
                {t('wechatShareDismiss')}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
